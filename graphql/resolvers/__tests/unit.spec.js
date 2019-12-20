const { initTest } = require('../../../helpers/tests');
const { Query } = require('../unit');
const Unit = require('../../../models/unit');

initTest();
describe('user resolver', () => {
  it('should get all units', async (done) => {
    let units = await Query.units();
    expect(units).toHaveLength(0);
    const unit = new Unit({ name: 'lbs' });
    await unit.save();
    units = await Query.units();
    expect(units).toHaveLength(1);
    done();
  });
});
