require('dotenv').config();

const app = require('../lib/app');
const request = require('supertest');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Meme = require('../lib/models/Meme');

describe('meme routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can creates a new meme', () => {
    return request(app)
      .post('/api/v1/memes')
      .send({ top: 'mongo', image: 'image@url.com', bottom: 'mongoose' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          top: 'mongo',
          image: 'image@url.com',
          bottom: 'mongoose',
          __v: 0
        });
      });
  });

  it('can get all memes', async() => {
    const meme = await Meme.create([
      { top: 'mongo', image: 'image@url.com', bottom: 'mongoose' },
      { top: 'mongo2', image: 'image2@url.com', bottom: 'mongoose2' },
      { top: 'mongo3', image: 'image3@url.com', bottom: 'mongoose3' },
    ]);
    return request(app)
      .get('/api/v1/memes')
      .then(res => {
        const memeJSON = JSON.parse(JSON.stringify(meme));
        memeJSON.forEach(meme => {
          expect(res.body).toContainEqual(meme);
        });
      });
  });
  
  it('can get a meme by id', async() => {
    const meme = await Meme.create({ top: 'mongo', image: 'image@url.com', bottom: 'mongoose' });

    return request(app)
      .get(`/api/v1/memes/${meme._id}`)
      .then(res => {
        const memeJSON = JSON.parse(JSON.stringify(meme))
        expect(res.body).toEqual(memeJSON);
      });
  });

  it('can update a meme by id', async() => {
    const meme = await Meme.create({ top: 'mongo', image: 'image@url.com', bottom: 'mongoose' });

    return request(app)
      .put(`/api/v1/memes/${meme._id}`)
      .send({ top: 'mongo2', image: 'image2@url.com', bottom: 'mongoose2' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          top: 'mongo2',
          image: 'image2@url.com',
          bottom: 'mongoose2',
          __v: 0
        });
      });
  });

  it('deletes a meme', async() => {
    const meme = await Meme.create({ top: 'mongo', image: 'image@url.com', bottom: 'mongoose' });

    return request(app)
    .delete(`/api/v1/memes/${meme._id}`)
    .then(res => {
      expect(res.body.top).toEqual('mongo');
    });
  });
});
