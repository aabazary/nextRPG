import mongoose from 'mongoose';
import Character from '@/models/Character';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('Character Model', () => {
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
  it('should create a character with default values', async () => {
    const character = await Character.create({
      name: 'Test Character',
      class: 'Mage',
      armor: {
        helmet: 1,
        chestPiece: 1,
        leggings: 1,
        boots: 1,
        gloves: 1,
      },
    });

    expect(character.name).toBe('Test Character');
    expect(character.class).toBe('Mage');
    expect(character.gold).toBe(0);
    expect(character.potionBag.tier1).toBe(0);
    expect(character.progress.mobsKilled).toBe(0);
  });

  it('should calculate level correctly', async () => {
    const character = await Character.create({
      name: 'Test Character',
      class: 'Hunter',
      experience: 600,
      armor: {
        helmet: 1,
        chestPiece: 1,
        leggings: 1,
        boots: 1,
        gloves: 1,
      },
    });

    expect(character.level).toBe(3); 
  });

  it('should calculate health correctly based on class and armor', async () => {
    const character = await Character.create({
      name: 'Test Character',
      class: 'Warrior',
      experience: 1000,
      armor: {
        helmet: 2,
        chestPiece: 2,
        leggings: 2,
        boots: 2,
        gloves: 2,
      },
    });

    const baseHealth = 10;
    const levelContribution = (character.level - 1) * 10;
    const armorContribution = 100; 
    const classMultiplier = 2; 

    const expectedHealth =
      (baseHealth + levelContribution + armorContribution) * classMultiplier;

    expect(character.health).toBe(expectedHealth);
  });

  it('should calculate casting resource correctly', async () => {
    const character = await Character.create({
      name: 'Test Character',
      class: 'Mage',
      experience: 1200,
      armor: {
        helmet: 1,
        chestPiece: 1,
        leggings: 1,
        boots: 1,
        gloves: 1,
      },
    });

    const expectedResource = 100 + (character.level - 1) * 10;
    expect(character.castingResource).toBe(expectedResource);
  });

  it('should calculate preparedness correctly', async () => {
    const character = await Character.create({
      name: 'Test Character',
      class: 'Hunter',
      armor: {
        helmet: 1,
        chestPiece: 2,
        leggings: 3,
        boots: 1,
        gloves: 1,
      },
    });
    expect(character.preparedness).toBe(10);
  });

  it('should calculate power correctly', async () => {
    const character = await Character.create({
      name: 'Test Character',
      class: 'Mage',
      experience: 300,
      armor: {
        helmet: 3,
        chestPiece: 3,
        leggings: 3,
        boots: 3,
        gloves: 3,
      },
    });

    const expectedPower = character.level + character.preparedness;
    expect(character.power).toBe(expectedPower);
  });
});
