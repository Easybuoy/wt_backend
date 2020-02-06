const {
  initTest,
  createUser,
} = require('../../../helpers/tests');
const authResolver = require('../auth');
const friendResolver = require('../friend');
const context = require('../../../graphql/context');

initTest();

describe('friends resolver', () => {
  describe('findFriends endpoint', () => {
    it('should get suggestions when NOT searching friends', async (done) => {
      // create users
      let testUser1 = await createUser();
      let testUser2 = await createUser({
        firstname: 'Test',
        lastname: 'User2',
        email: 'test@user2.com',
        password: 'testUser2!',
      });
      const updateUserDetails = { input: { goal: 'Athletic' } };
      // make them have the same fitness goal
      testUser1 = await authResolver.Mutation.updateUser(
        null,
        updateUserDetails,
        { user: { id: testUser1.id } }
      );
      testUser2 = await authResolver.Mutation.updateUser(
        null,
        updateUserDetails,
        { user: { id: testUser2.id } }
      );
      // check if test users are good to proceed
      expect(testUser1.id).not.toBeNull();
      expect(testUser2.id).not.toBeNull();
      // find suggestions for user 1
      const findFriends = await friendResolver.Query.findFriends(
        null,
        { input: { search: '', fields: ['firstname', 'lastname'] } },
        { user: { id: testUser1.id } }
      );
      // expect user 2 to be suggested
      expect(findFriends).toHaveLength(1);
      expect(findFriends[0].id).toBe(testUser2.id);
      done();
    });
    it('should find users based on searched terms', async (done) => {
      // create users
      const testUser1 = await createUser();
      const testUser2 = await createUser({
        firstname: 'Test',
        lastname: 'User2',
        email: 'test@user2.com',
        password: 'testUser2!',
      });
      // check if test users are good to proceed
      expect(testUser1.id).not.toBeNull();
      expect(testUser2.id).not.toBeNull();
      // find users with the search "User2"
      const findFriends = await friendResolver.Query.findFriends(
        null,
        { input: { search: 'User2', fields: ['firstname', 'lastname'] } },
        { user: { id: testUser1.id } }
      );
      // expect user 2 to be in the search results
      expect(findFriends).toHaveLength(1);
      expect(findFriends[0].id).toBe(testUser2.id);
      done();
    });
  });
  describe('friends list endpoint', () => {
    it('should get a user\'s list of friends', async (done) => {
      // create users
      const testUser1 = await createUser();
      const testUser2 = await createUser({
        firstname: 'Test',
        lastname: 'User2',
        email: 'test@user2.com',
        password: 'testUser2!',
      });
      // check if test users are good to proceed
      expect(testUser1.id).not.toBeNull();
      expect(testUser2.id).not.toBeNull();
      // create user context variables
      const contextUser1 = await context({
        req: {
          headers: {
            authorization: testUser1.token
          }
        }
      });
      const contextUser2 = await context({
        req: {
          headers: {
            authorization: testUser2.token
          }
        }
      });
      // add testUser2 as friend
      await friendResolver.Mutation.manageFriends(
        null,
        { userId: testUser2.id, task: 'add' },
        contextUser1
      );
      // accept friend request
      await friendResolver.Mutation.manageFriends(
        null,
        { userId: testUser1.id, task: 'response_1' },
        contextUser2
      );
      // get friend list of user 1
      const friends = await friendResolver.Query.friends(null, null, contextUser1);
      expect(friends).toHaveLength(1);
      expect(friends[0].id).toBe(testUser2.id);
      done();
    });
  });
  describe('friend requests endpoint', () => {
    it('should get a user\'s list of friend requests', async (done) => {
      // create users
      const testUser1 = await createUser();
      const testUser2 = await createUser({
        firstname: 'Test',
        lastname: 'User2',
        email: 'test@user2.com',
        password: 'testUser2!',
      });
      // check if test users are good to proceed
      expect(testUser1.id).not.toBeNull();
      expect(testUser2.id).not.toBeNull();
      // create user context variables
      const contextUser2 = await context({
        req: {
          headers: {
            authorization: testUser2.token
          }
        }
      });
      // add testUser2 as friend
      await friendResolver.Mutation.manageFriends(
        null,
        { userId: testUser1.id, task: 'add' },
        contextUser2
      );
      // get friend list of user 1
      const friendRequests = await friendResolver.Query.friendRequests(null, null, {
        user: { id: testUser1.id }
      });
      expect(friendRequests).toHaveLength(1);
      expect(friendRequests[0].id).toBe(testUser2.id);
      done();
    });
  });
  describe('sendMessage endpoint', () => {
    it('should send messages between users', async (done) => {
      // create users
      const testUser1 = await createUser();
      const testUser2 = await createUser({
        firstname: 'Test',
        lastname: 'User2',
        email: 'test@user2.com',
        password: 'testUser2!',
      });
      // check if test users are good to proceed
      expect(testUser1.id).not.toBeNull();
      expect(testUser2.id).not.toBeNull();
      // create user context variables
      const contextUser1 = await context({
        req: {
          headers: {
            authorization: testUser1.token
          }
        }
      });
      // send message from user 1 to user 2
      const message = 'Hello testUser2!';
      await friendResolver.Mutation.sendMessage(
        null,
        {
          receiver: testUser2.id,
          message
        },
        contextUser1
      );
      // check if the message was sent
      const friendChat = await friendResolver.Query.friendChat(
        null,
        { receiver: testUser2.id },
        contextUser1
      );
      expect(friendChat).toHaveLength(1);
      expect(friendChat[0].message).toBe(message);
      done();
    });
  });
});
