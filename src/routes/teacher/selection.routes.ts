import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { selectionActionsService } from '../../services/teacher/selectionActionsService.js';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';

const router = Router();

router.use(authenticateTeacher);

const simplifySchema = z.object({
  text: z.string().min(1).max(10000),
  targetGrade: z.string().optional().default('K-2'),
});

const redraftSchema = z.object({
  text: z.string().min(1).max(10000),
  style: z.string().optional(),
});

const expandSchema = z.object({
  text: z.string().min(1).max(10000),
});

const translateSchema = z.object({
  text: z.string().min(1).max(10000),
  targetLanguage: z.enum(['Spanish', 'French']),
});

router.post('/simplify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, targetGrade } = simplifySchema.parse(req.body);
    const result = await selectionActionsService.simplify(text, targetGrade, req.teacher!.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/redraft', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, style } = redraftSchema.parse(req.body);
    const result = await selectionActionsService.redraft(text, style, req.teacher!.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/expand', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = expandSchema.parse(req.body);
    const result = await selectionActionsService.expand(text, req.teacher!.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/translate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, targetLanguage } = translateSchema.parse(req.body);
    const result = await selectionActionsService.translate(text, targetLanguage, req.teacher!.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export default router;
