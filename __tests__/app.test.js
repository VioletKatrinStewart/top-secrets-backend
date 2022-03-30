const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

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

  it('signs in an existing user', async () => {
    const user = await UserService.create({
      username: 'violet',
      password: 'violetiscool',
    });

    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ username: 'violet', password: 'violetiscool' });

    expect(res.body).toEqual({
      message: 'You are signed in!',
      user,
    });
  });

  it('should sign out user and return signed out message', async () => {
    await UserService.create({
      username: 'violet',
      password: 'violetiscool',
    });
    await UserService.signIn({
      username: 'violet',
      password: 'violetiscool',
    });

    const res = await request(app).delete('/api/v1/users/sessions');

    expect(res.body).toEqual({
      success: true,
      message: 'Signed out successfully!',
    });
  });
});
