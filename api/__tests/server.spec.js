const request = require('supertest');
const { initTest } = require('../../helpers/tests');
const { env } = require('../../config');
const server = require('../server');

initTest();

describe('server', () => {
  it('the db env is using testing', () => {
    expect(env).toBe('testing');
  });
  it('should return 200 OK', (done) => {
    request(server)
      .get('/')
      .expect(200)
      .end(done);
  });
  it('returns the right response body', (done) => {
    request(server)
      .get('/')
      .expect({ up: 'workout or stay-out!!!' })
      .end(done);
  });
});
