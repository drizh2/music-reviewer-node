import express from 'express';
import reviews from './reviews';

const router = express.Router();

router.use('/reviews', reviews);

export default router;
