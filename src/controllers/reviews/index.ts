import {Request, Response} from "express";
import httpStatus from "http-status";
import {InternalError} from "../../system/internalError";
import log4js from "log4js";
import {ReviewSaveDto} from "../../dto/review/reviewSaveDto";
import {createReview,
  getReviewsBySongId as getReviewsBySongIdApi,
  getReviewCountsBySongIds as getReviewCountsBySongIdsApi} from "../../services/review";

export const saveReview = async (req: Request, res: Response) => {
  try {
    const reviewSaveDto = new ReviewSaveDto(req.body);
    const id = await createReview(reviewSaveDto);
    res.status(httpStatus.CREATED).send({
      id,
    });
  } catch (err) {
    const { message, status } = new InternalError(err);
    log4js.getLogger().error('Error in creating group.', err);
    res.status(status).send({ message });
  }
};

export const getReviewsBySongId = async (req: Request, res: Response) => {
  const { songId, size, from } = req.query;

  if (!songId) {
    return res.status(400).json({ error: 'songId is required' });
  }
  const sizeNumber = parseInt(size as string, 10);
  const fromNumber = parseInt(from as string, 10);

  if (isNaN(sizeNumber) || isNaN(fromNumber)) {
    return res.status(400).json({ error: 'size and from must be valid numbers' });
  }

  try {
    const reviews = await getReviewsBySongIdApi(songId as string, sizeNumber, fromNumber);
    return res.json(reviews);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export const getReviewCountsBySongIds = async (req: Request, res: Response) => {
  const { songIds } = req.body;

  // Validate required parameter
  if (!Array.isArray(songIds) || songIds.length === 0) {
    return res.status(400).json({ error: 'songIds is required and must be a non-empty array' });
  }

  try {
    const counts = await getReviewCountsBySongIdsApi(songIds);
    return res.json(counts);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};