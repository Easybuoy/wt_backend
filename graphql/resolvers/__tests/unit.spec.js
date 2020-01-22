const { initTest } = require('../../../helpers/tests');
const Unit = require('../../../models/unit');
const unitResolver = require('../unit');

initTest();

describe('user resolver', () => {
  it('should get all units', async (done) => {
    const newUnit = new Unit({ name: 'kg', type: 'weight' });
    await newUnit.save();
    const units = await unitResolver.Query.units();
    expect(units).toBeDefined();
    done();
  });
  it('should get unit by id', async (done) => {
    const newUnit = new Unit({ name: 'kg', type: 'weight' });
    const savedUnit = await newUnit.save();
    const unit = await unitResolver.Query.unitById(null, { id: savedUnit._id });
    expect(unit).toBeDefined();
    done();
  });
});
