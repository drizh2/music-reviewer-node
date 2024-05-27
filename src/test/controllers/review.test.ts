import chai from 'chai';
import chaiHttp from 'chai-http';
// import sinon from 'sinon';
import mongoose, {ConnectOptions} from 'mongoose';
import express from 'express';
import Review from "../../model/review";
import routers from "../../routers/reviews";
// import { createReview, getReviewsBySongId as getReviewsBySongIdApi, getReviewCountsBySongIds as getReviewCountsBySongIdsApi } from '../src/services/review';

chai.use(chaiHttp);
const { expect } = chai;

// Initialize the Express application
const app = express();
app.use(express.json());
app.use('/', routers);

describe('Review API', () => {
  before(async () => {
    const url = `mongodb://127.0.0.1:27018/reviewTestDb`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions);
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Create some test data
    await Review.insertMany([
      { songId: 'testSongId1', reviewerName: 'User1', rating: 4, comment: 'Great!', publishDate: new Date() },
      { songId: 'testSongId1', reviewerName: 'User2', rating: 5, comment: 'Awesome!', publishDate: new Date() },
      { songId: 'testSongId2', reviewerName: 'User3', rating: 3, comment: 'Good', publishDate: new Date() },
    ]);
  });

  afterEach(async () => {
    await Review.deleteMany({});
  });

  it('should create a new review (POST /api/entity3)', async () => {
    const newReview = {
      songId : "5",
      reviewerName : "Oleg",
      rating : 5,
      comment : "The best",
      publishDate : "2004-12-28",
    };

    const res = await chai.request(app)
      .post('/')
      .send(newReview);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('id');
  });

  it('should get reviews by song ID (GET /api/entity3)', async () => {
    const res = await chai.request(app)
      .get('/')
      .query({ songId: 'testSongId1', size: 10, from: 0 });

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(2);
    expect(res.body[0]).to.include({ reviewerName: 'User1' });
    expect(res.body[1]).to.include({ reviewerName: 'User2' });
  });

  it('should get review counts by song IDs (POST /api/entity3/_counts)', async () => {
    const res = await chai.request(app)
      .post('/_counts')
      .send({ songIds: ['testSongId1', 'testSongId2', 'nonExistentSongId'] });

    expect(res).to.have.status(200);
    expect(res.body).to.deep.equal({
      testSongId1: 2,
      testSongId2: 1,
      nonExistentSongId: 0,
    });
  });
});
