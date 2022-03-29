const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('top-secrets-backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('signs up a user via POST', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ username: 'violet', password: 'violetiscool' });

    expect(res.body).toEqual({ id: expect.any(String), username: 'violet' });
  });
});
