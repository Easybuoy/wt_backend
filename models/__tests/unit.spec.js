const { initTest } = require('../../helpers/tests');
const Unit = require('../unit');

initTest();

describe('Unit', () => {
  it('it should be able to save an entry to the table', async (done) => {
    const unit = new Unit({ name: 'kg' });
    await unit.save();
    const units = await Unit.find();
    expect(units).toHaveLength(1);
    done();
  });
});
