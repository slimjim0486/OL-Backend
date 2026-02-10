// Enterprise authentication middleware
// Chains after authenticateTeacher to add enterprise-level checks
import { Request, Response, NextFunction } from 'express';
import { EnterpriseRole } from '@prisma/client';
import { ForbiddenError } from './errorHandler.js';

/**
 * Requires the teacher to belong to a school (enterprise user).
 * Must be chained after authenticateTeacher.
 */
export function requireSchool(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.teacher) {
    throw new ForbiddenError('Teacher authentication required');
  }

  if (!req.teacher.schoolId) {
    throw new ForbiddenError('Enterprise school membership required');
  }

  next();
}

/**
 * Requires the teacher to have one of the specified enterprise roles.
 * Must be chained after authenticateTeacher.
 */
export function requireEnterpriseRole(...roles: EnterpriseRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.teacher) {
      throw new ForbiddenError('Teacher authentication required');
    }

    if (!req.teacher.enterpriseRole) {
      throw new ForbiddenError('Enterprise role required');
    }

    if (!roles.includes(req.teacher.enterpriseRole)) {
      throw new ForbiddenError(
        `Required enterprise role: ${roles.join(' or ')}`
      );
    }

    next();
  };
}

/**
 * Scopes the request to the teacher's school.
 * Sets req.schoolId for use in downstream handlers.
 * Must be chained after authenticateTeacher.
 */
export function scopeToSchool(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.teacher) {
    throw new ForbiddenError('Teacher authentication required');
  }

  if (!req.teacher.schoolId) {
    throw new ForbiddenError('Enterprise school membership required');
  }

  // Set school ID on request for query scoping
  req.schoolId = req.teacher.schoolId;

  next();
}
