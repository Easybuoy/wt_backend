const { initTest } = require('../../../helpers/tests');
const { Query } = require('../unit');

initTest();
describe('user resolver', () => {
  it('should get all units', async (done) => {
    const units = await Query.units();
    expect(units).toHaveLength(0);
    done();
  });
});
