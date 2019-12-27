const request = require('supertest');
const { env } = require('../../config');
const server = require('../server');

describe('server', () => {
  describe('[GET] / endpoint', () => {
    it('the db env is using testing', () => {
      expect(env).toBe('testing');
    });
    it('should return 200 OK', async (done) => {
      const response = await request(server).get('/');
      expect(response.status).toBe(200);
      done();
    });
    it('returns the right response body', async (done) => {
      const response = await request(server).get('/');
      expect(response.body).toEqual({ up: 'workout or stay-out!!!' });
      done();
    });
  });
});
