const request = require('supertest');
const app = require('../src/app');

describe('Express application', () => {
  test('serves the health endpoint', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok' });
  });

  test('returns JSON for unknown API routes', async () => {
    const response = await request(app).get('/api/does-not-exist');
    expect(response.status).toBe(404);
    expect(response.body.message).toContain('Route not found');
  });
});