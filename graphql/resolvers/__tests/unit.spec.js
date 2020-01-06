const { initTest, getUnits } = require('../../../helpers/tests');
const Unit = require('../../../models/unit');

initTest();
describe('user resolver', () => {
  it('should get all units', async (done) => {
    let allUnits = await getUnits();
    expect(allUnits).toHaveLength(0);
    const unit = new Unit({ name: 'kg', type: 'weight' });
    const unitSaved = await unit.save();
    expect(unitSaved.id).toBeDefined();
    allUnits = await getUnits();
    expect(allUnits).toHaveLength(1);
    done();
  });
});
