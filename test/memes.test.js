const app = require('../lib/app');
const request = require('supertest');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');

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
});
