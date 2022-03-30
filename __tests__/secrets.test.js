const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('does not create a secret because you are not logged in', async () => {
    const expected = {
      title: 'DO NOT READ',
      description: 'SHHHH THIS IS A SECRET',
    };
    const res = await request(app).post('/api/v1/secrets').send(expected);
    expect(res.body).toEqual({
      status: 401,
      message: 'You need to be signed in to view this page',
    });
  });
});
