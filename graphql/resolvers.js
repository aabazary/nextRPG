import User from "../models/User";
import Character from "../models/Character.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Helper function for creating JWT token
const createToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, 'your-secret-key', { expiresIn: '1h' });
};

const resolvers = {
  Query: {
    // Query to get a user by ID
    getUser: async (_, { id }) => {
      try {
        return await User.findById(id).populate('characters');
      } catch (error) {
        throw new Error('User not found');
      }
    },

    // Query to get a character by ID
    getCharacter: async (_, { id }) => {
      try {
        return await Character.findById(id);
      } catch (error) {
        throw new Error('Character not found');
      }
    },

    // Query to get all users
    getAllUsers: async () => {
      try {
        return await User.find().populate('characters');
      } catch (error) {
        throw new Error('Error fetching users');
      }
    },

    // Query to get all characters
    getAllCharacters: async () => {
      try {
        return await Character.find();
      } catch (error) {
        throw new Error('Error fetching characters');
      }
    },
  },

  Mutation: {
    // Mutation for user registration
    register: async (_, { email, password }) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error('User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        return newUser;
      } catch (error) {
        throw new Error('Error registering user');
      }
    },

    // Mutation for user login (returns a JWT token)
    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) throw new Error('User not found');

        // Compare provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

        return {
          token, // Return the token
          user,  // Optionally return user data if needed
        };
      } catch (error) {
        throw new Error('Error logging in');
      }
    },

    // Mutation to create a new character
    createCharacter: async (_, { userId, name, class: characterClass }) => {
      try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const newCharacter = new Character({
          name,
          class: characterClass,
          health: 100, // Default values, can be customized
          castingResource: 50,
          power: 25,
          defense: 15,
          preparedness: 10,
          inventory: {},
          armor: { helmet: 5, chestpiece: 10, leggings: 8, boots: 6, gloves: 4 },
        });

        await newCharacter.save();

        user.characters.push(newCharacter);
        await user.save();

        return newCharacter;
      } catch (error) {
        throw new Error('Error creating character');
      }
    },


    // Mutation to delete a character
    deleteCharacter: async (_, { characterId }) => {
      try {
        const character = await Character.findByIdAndDelete(characterId);
        if (!character) throw new Error('Character not found');

        return 'Character deleted successfully';
      } catch (error) {
        throw new Error('Error deleting character');
      }
    },
  },
};

export default resolvers;
