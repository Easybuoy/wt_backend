const { initTest, createUser, query } = require('../../../helpers/tests');
const Unit = require('../../../models/unit');
const UnitDL = require('../unit');

initTest();

describe('Unit data loader', () => {
  it('Should only make one database request when getting user units', async (done) => {
    const DLSpy = jest.spyOn(UnitDL, 'unitDataLoader');
    // create a new user
    const testUser = await createUser();
    expect(testUser.id).toBeDefined();
    expect(testUser.token).toBeDefined();
    // create new units
    let weight = new Unit({ name: 'kg', type: 'weight' });
    let height = new Unit({ name: 'cm', type: 'height' });
    weight = await weight.save();
    height = await height.save();
    expect(weight.id).toBeDefined();
    expect(height.id).toBeDefined();
    const units = await Unit.find();
    expect(units).toHaveLength(2);
    // update user with new units
    await query(`
      mutation {
        updateUser(input: { 
          id: "${testUser.id}", 
          weightUnit: "${weight.id}", 
          heightUnit: "${height.id}"
        }) {
          id
          weightUnit {
            id
            name
          }
          heightUnit {
            id
            name
          }
        }
      }
    `, testUser.token);
    // dataloader must only run once even when fetching more than 1 unit
    expect(DLSpy).toHaveBeenCalledTimes(1);
    done();
  });
});
