import { Router } from 'express';
import { addComment, getCommentsByIncident } from '../controllers/comment.controller';

const router = Router();

router.post('/', addComment);
router.get('/:id', getCommentsByIncident);

export default router;
