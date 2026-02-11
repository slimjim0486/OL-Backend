import jwt from 'jsonwebtoken';
import { TeacherRole } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { config } from '../../config/index.js';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../middleware/errorHandler.js';

const INVITE_TOKEN_TYPE = 'organization_invite';
const INVITE_SECRET = process.env.ORG_INVITE_SECRET || config.jwtAccessSecret;
const ADMIN_ROLES: TeacherRole[] = [TeacherRole.ADMIN, TeacherRole.SUPER_ADMIN];

type InviteTokenPayload = {
  type: typeof INVITE_TOKEN_TYPE;
  organizationId: string;
  email: string;
  role: TeacherRole;
  invitedByTeacherId: string;
  iat: number;
  exp: number;
};

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

function isOrganizationActive(organization: { subscriptionStatus: string; subscriptionExpiresAt: Date | null }): boolean {
  if (organization.subscriptionStatus !== 'ACTIVE') {
    return false;
  }
  if (organization.subscriptionExpiresAt && organization.subscriptionExpiresAt.getTime() <= Date.now()) {
    return false;
  }
  return true;
}

async function getOrganizationSeatStats(organizationId: string): Promise<{
  seatLimit: number;
  occupiedSeats: number;
  availableSeats: number;
}> {
  const [organization, occupiedSeats] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        seatLimit: true,
      },
    }),
    prisma.teacher.count({
      where: { organizationId },
    }),
  ]);

  if (!organization) {
    throw new NotFoundError('Organization not found');
  }

  return {
    seatLimit: organization.seatLimit,
    occupiedSeats,
    availableSeats: Math.max(0, organization.seatLimit - occupiedSeats),
  };
}

function validateAssignableRole(role: TeacherRole): void {
  if (role === TeacherRole.SUPER_ADMIN) {
    throw new ValidationError('SUPER_ADMIN role cannot be assigned through seat management.');
  }
}

export const organizationSeatService = {
  async ensureSeatAvailable(organizationId: string, seatsNeeded: number = 1): Promise<void> {
    if (seatsNeeded <= 0) {
      return;
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        name: true,
        subscriptionStatus: true,
        subscriptionExpiresAt: true,
      },
    });

    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    if (!isOrganizationActive(organization)) {
      throw new ForbiddenError('Organization subscription is not active.');
    }

    const { availableSeats } = await getOrganizationSeatStats(organizationId);
    if (availableSeats < seatsNeeded) {
      throw new ConflictError(`No available seats. This organization has ${availableSeats} seat(s) remaining.`);
    }
  },

  async listOrganizationSeats(organizationId: string) {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        name: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        billingInterval: true,
        seatLimit: true,
        subscriptionExpiresAt: true,
        createdAt: true,
      },
    });

    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    const members = await prisma.teacher.findMany({
      where: { organizationId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
      },
      orderBy: [
        { role: 'desc' },
        { createdAt: 'asc' },
      ],
    });

    const occupiedSeats = members.length;
    const availableSeats = Math.max(0, organization.seatLimit - occupiedSeats);

    return {
      organization,
      seats: {
        limit: organization.seatLimit,
        occupied: occupiedSeats,
        available: availableSeats,
      },
      members,
    };
  },

  createInviteToken(params: {
    organizationId: string;
    email: string;
    role: TeacherRole;
    invitedByTeacherId: string;
    expiresInDays?: number;
  }): { token: string; expiresAt: Date } {
    const expiresInDays = params.expiresInDays ?? 7;
    if (expiresInDays < 1 || expiresInDays > 30) {
      throw new ValidationError('Invite expiry must be between 1 and 30 days.');
    }

    validateAssignableRole(params.role);

    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    const token = jwt.sign(
      {
        type: INVITE_TOKEN_TYPE,
        organizationId: params.organizationId,
        email: normalizeEmail(params.email),
        role: params.role,
        invitedByTeacherId: params.invitedByTeacherId,
      },
      INVITE_SECRET,
      { expiresIn: `${expiresInDays}d` }
    );

    return { token, expiresAt };
  },

  verifyInviteToken(token: string): InviteTokenPayload {
    try {
      const payload = jwt.verify(token, INVITE_SECRET) as InviteTokenPayload;
      if (payload.type !== INVITE_TOKEN_TYPE) {
        throw new ValidationError('Invalid organization invite token.');
      }
      if (!payload.organizationId || !payload.email || !payload.role || !payload.invitedByTeacherId) {
        throw new ValidationError('Organization invite token is missing required fields.');
      }
      return payload;
    } catch (error: any) {
      if (error?.name === 'TokenExpiredError') {
        throw new ValidationError('Organization invite has expired.');
      }
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError('Invalid organization invite token.');
    }
  },

  async assignTeacherToOrganization(params: {
    organizationId: string;
    teacherId: string;
    role?: TeacherRole;
  }) {
    const role = params.role || TeacherRole.TEACHER;
    validateAssignableRole(role);

    const teacher = await prisma.teacher.findUnique({
      where: { id: params.teacherId },
      select: {
        id: true,
        organizationId: true,
      },
    });

    if (!teacher) {
      throw new NotFoundError('Teacher not found.');
    }

    if (teacher.organizationId && teacher.organizationId !== params.organizationId) {
      throw new ConflictError('Teacher already belongs to another organization.');
    }

    if (!teacher.organizationId) {
      await this.ensureSeatAvailable(params.organizationId);
    }

    return prisma.teacher.update({
      where: { id: params.teacherId },
      data: {
        organizationId: params.organizationId,
        role,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        organizationId: true,
      },
    });
  },

  async removeTeacherFromOrganization(params: {
    organizationId: string;
    teacherId: string;
    actingTeacherId: string;
  }) {
    const member = await prisma.teacher.findUnique({
      where: { id: params.teacherId },
      select: {
        id: true,
        organizationId: true,
        role: true,
      },
    });

    if (!member || member.organizationId !== params.organizationId) {
      throw new NotFoundError('Teacher is not a member of this organization.');
    }

    if (ADMIN_ROLES.includes(member.role)) {
      const adminCount = await prisma.teacher.count({
        where: {
          organizationId: params.organizationId,
          role: { in: ADMIN_ROLES },
        },
      });

      if (adminCount <= 1) {
        throw new ValidationError('Cannot remove the last organization admin.');
      }
    }

    if (params.teacherId === params.actingTeacherId) {
      throw new ValidationError('Use another admin account to remove your own seat.');
    }

    return prisma.teacher.update({
      where: { id: params.teacherId },
      data: {
        organizationId: null,
        role: TeacherRole.TEACHER,
      },
      select: {
        id: true,
        email: true,
        role: true,
        organizationId: true,
      },
    });
  },

  async reassignSeat(params: {
    organizationId: string;
    fromTeacherId: string;
    toTeacherId: string;
    toRole?: TeacherRole;
  }) {
    if (params.fromTeacherId === params.toTeacherId) {
      throw new ValidationError('Source and destination teacher must be different.');
    }

    const toRole = params.toRole || TeacherRole.TEACHER;
    validateAssignableRole(toRole);

    return prisma.$transaction(async (tx) => {
      const [fromMember, toTeacher] = await Promise.all([
        tx.teacher.findUnique({
          where: { id: params.fromTeacherId },
          select: { id: true, organizationId: true, role: true },
        }),
        tx.teacher.findUnique({
          where: { id: params.toTeacherId },
          select: { id: true, organizationId: true },
        }),
      ]);

      if (!fromMember || fromMember.organizationId !== params.organizationId) {
        throw new NotFoundError('Source teacher is not a member of this organization.');
      }
      if (!toTeacher) {
        throw new NotFoundError('Destination teacher not found.');
      }
      if (toTeacher.organizationId && toTeacher.organizationId !== params.organizationId) {
        throw new ConflictError('Destination teacher already belongs to another organization.');
      }

      if (ADMIN_ROLES.includes(fromMember.role)) {
        const adminCount = await tx.teacher.count({
          where: {
            organizationId: params.organizationId,
            role: { in: ADMIN_ROLES },
          },
        });
        const destinationWillBeAdmin = ADMIN_ROLES.includes(toRole);
        if (adminCount <= 1 && !destinationWillBeAdmin) {
          throw new ValidationError('Cannot remove the last organization admin without assigning another admin.');
        }
      }

      await tx.teacher.update({
        where: { id: params.fromTeacherId },
        data: {
          organizationId: null,
          role: TeacherRole.TEACHER,
        },
      });

      const updated = await tx.teacher.update({
        where: { id: params.toTeacherId },
        data: {
          organizationId: params.organizationId,
          role: toRole,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          organizationId: true,
        },
      });

      return updated;
    });
  },
};

