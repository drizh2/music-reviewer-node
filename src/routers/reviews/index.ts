import express from 'express';
import {saveReview, getReviewsBySongId, getReviewCountsBySongIds} from "src/controllers/reviews";

const router = express.Router();

router.post('', saveReview);
router.get('', getReviewsBySongId);
router.post('/_counts', getReviewCountsBySongIds);

export default router;