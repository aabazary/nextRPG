import User from "../../models/User.js"
import Character from "../../models/Character.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const seedData = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/rpg-game', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await User.deleteMany({});
    await Character.deleteMany({});

    const characters = [
      {
        name: 'Thalador',
        class: 'Warrior',
        inventory: { sword: 1, shield: 1 },
        gold: 100,
        armor: {
          helmet: 1,
          chestPiece: 1,
          leggings: 1,
          boots: 1,
          gloves: 1,
        },
        progress: {
          mobsKilled: 10,
          questsCompleted: 2,
          gatherings: 5,
        },
        potionBag: {
          tier1: 2,
          tier2: 1,
          tier3: 0,
          tier4: 0,
          tier5: 0,
          tier6: 0,
          tier7: 0,
          tier8: 0,
          tier9: 0,
          tier10: 0,
        },
        experience: 500,
        score: 1200,
      },
      {
        name: 'Elariel',
        class: 'Mage',
        inventory: { staff: 1, book: 1 },
        gold: 50,
        armor: {
          helmet: 0,
          chestPiece: 0,
          leggings: 0,
          boots: 0,
          gloves: 0,
        },
        progress: {
          mobsKilled: 5,
          questsCompleted: 1,
          gatherings: 3,
        },
        potionBag: {
          tier1: 1,
          tier2: 0,
          tier3: 0,
          tier4: 0,
          tier5: 0,
          tier6: 0,
          tier7: 0,
          tier8: 0,
          tier9: 0,
          tier10: 0,
        },
        experience: 100,
        score: 300,
      },
      {
        name: 'Kaelron',
        class: 'Hunter',
        inventory: { bow: 1, arrows: 20 },
        gold: 75,
        armor: {
          helmet: 2,
          chestPiece: 2,
          leggings: 2,
          boots: 2,
          gloves: 2,
        },
        progress: {
          mobsKilled: 20,
          questsCompleted: 5,
          gatherings: 8,
        },
        potionBag: {
          tier1: 3,
          tier2: 1,
          tier3: 1,
          tier4: 0,
          tier5: 0,
          tier6: 0,
          tier7: 0,
          tier8: 0,
          tier9: 0,
          tier10: 0,
        },
        experience: 1500,
        score: 2500,
      },
    ];

    const insertedCharacters = await Character.insertMany(characters);

    const users = [
      {
        username: 'player1',
        email: 'player1@example.com',
        password: await bcrypt.hash('password1', 10),
        characters: [insertedCharacters[0]._id],
      },
      {
        username: 'player2',
        email: 'player2@example.com',
        password: await bcrypt.hash('password2', 10),
        characters: [insertedCharacters[1]._id],
      },
      {
        username: 'player3',
        email: 'player3@example.com',
        password: await bcrypt.hash('password3', 10), 
        characters: [insertedCharacters[2]._id],
      },
    ];

    await User.insertMany(users);

    console.log('Seed data added successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
