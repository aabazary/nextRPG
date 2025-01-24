import mongoose from 'mongoose';
import User from '@/models/User';
import Character from '@/models/Character';

describe('User Model', () => {
    let mongoServer;

    beforeAll(async () => {
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
      
        await mongoose.connect(uri); 
      });
      
      afterAll(async () => {
        if (mongoServer) {
          await mongoose.disconnect();
          await mongoServer.stop();
        }
      });

  it('should create a user with valid fields', async () => {
    const user = await User.create({
      email: 'test@example.com',
      username: 'TestUser',
      password: 'securepassword',
    });

    expect(user.email).toBe('test@example.com');
    expect(user.username).toBe('TestUser');
  });

  it('should allow assigning characters to a user', async () => {
    const character = await Character.create({
      name: 'Test Character',
      class: 'Warrior',
      armor: {
        helmet: 1,
        chestPiece: 1,
        leggings: 1,
        boots: 1,
        gloves: 1,
      },
    });

    const user = await User.create({
      email: 'test2@example.com',
      username: 'TestUser',
      password: 'securepassword',
      characters: [character._id],
      activeCharacter: character._id,
    });

    expect(user.characters.length).toBe(1);
    expect(user.characters[0].toString()).toBe(character._id.toString());
    expect(user.activeCharacter.toString()).toBe(character._id.toString());
  });

  it('should enforce unique emails for users', async () => {
    await User.create({
      email: 'duplicate@example.com',
      username: 'User1',
      password: 'password1',
    });

    await expect(
      User.create({
        email: 'duplicate@example.com',
        username: 'User2',
        password: 'password2',
      })
    ).rejects.toThrow(); 
  });
});
