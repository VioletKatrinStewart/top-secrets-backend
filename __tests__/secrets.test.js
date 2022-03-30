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

  it('posts a secret because user is logged in', async () => {
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

  it('gets a list of secrets', async () => {
    const agent = request.agent(app);
    const user = {
      username: 'violet',
      password: 'violetiscool',
    };
    await agent.post('/api/v1/users').send(user);
    await agent.post('/api/v1/users/sessions').send(user);

    const secret1 = {
      title: 'DO NOT READ',
      description: 'SHHHH THIS IS A SECRET',
    };
    await agent.post('/api/v1/secrets').send(secret1);

    const secret2 = {
      title: 'I LIKE SLEEPING',
      description: 'ZZZZZZZ',
    };
    await agent.post('/api/v1/secrets').send(secret2);
    const res = await agent.get('/api/v1/secrets');
    expect(res.body).toEqual([
      { ...secret1, id: expect.any(String), createdAt: expect.any(String) },
      { ...secret2, id: expect.any(String), createdAt: expect.any(String) },
    ]);
  });
});
