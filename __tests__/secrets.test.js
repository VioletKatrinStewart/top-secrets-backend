const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
//const UserService = require('../lib/services/UserService');

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

  it.only('posts a secret because user is logged in', async () => {
    const agent = request.agent(app);
    const user = {
      username: 'violet',
      password: 'violetiscool',
    };
    await agent.post('/api/v1/users').send(user);
    await agent.post('/api/v1/users/sessions').send(user);

    const expected = {
      title: 'DO NOT READ',
      description: 'SHHHH THIS IS A SECRET',
    };
    const res = await agent.post('/api/v1/secrets').send(expected);
    expect(res.body).toEqual({
      ...expected,
      id: expect.any(String),
      createdAt: expect.any(String),
    });
  });
});
