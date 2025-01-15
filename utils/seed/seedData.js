import User from "../../models/User.js"
import Character from "../../models/Character.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const seedData = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/rpg-game', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await User.deleteMany({});
    await Character.deleteMany({});

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user1 = new User({ email: 'user1@example.com', password: hashedPassword });
    const user2 = new User({ email: 'user2@example.com', password: hashedPassword });

    await user1.save();
    await user2.save();

    // Create sample characters
    const character1 = new Character({
      name: 'Aragorn',
      class: 'Warrior',
      health: 120,
      castingResource: 30,
      power: 40,
      defense: 25,
      preparedness: 15,
      inventory: { gold: 100 },
      armor: { helmet: 5, chestpiece: 10, leggings: 8, boots: 6, gloves: 4 },
    });

    const character2 = new Character({
      name: 'Gandalf',
      class: 'Mage',
      health: 80,
      castingResource: 100,
      power: 50,
      defense: 10,
      preparedness: 20,
      inventory: { manaPotions: 5 },
      armor: { helmet: 2, chestpiece: 3, leggings: 2, boots: 1, gloves: 1 },
    });

    await character1.save();
    await character2.save();

    // Associate characters with users
    user1.characters.push(character1);
    user2.characters.push(character2);

    await user1.save();
    await user2.save();

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
