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
          token, 
          user,  
        };
      } catch (error) {
        throw new Error('Error logging in');
      }
    },

    // Mutation to create a new character
    createCharacter: async (_, { userId, name, class: characterClass }) => {
      try {
        // Fetch the user by ID
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
    
        // Create a new character with the updated schema
        const newCharacter = new Character({
          name,
          class: characterClass,
          inventory: {}, 
          gold: 0,
          armor: { 
            helmet: 0, 
            chestPiece: 0, 
            leggings: 0, 
            boots: 0, 
            gloves: 0 
          }, 
          progress: {
            mobsKilled: 0,
            questsCompleted: 0,
            gatherings: 0,
          }, 
          potionBag: {
            tier1: 0,
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
          experience: 0, 
          score: 0, 
        });
    
        // Save the character
        await newCharacter.save();
    
        // Associate the character with the user
        user.characters.push(newCharacter);
        await user.save();
    
        // Return the newly created character
        return newCharacter;
      } catch (error) {
        throw new Error(`Error creating character: ${error.message}`);
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
    completeGatheringTask: async (_, { characterId, tier, successful }) => {
      try {
        const character = await Character.findById(characterId);
        if (!character) throw new Error('Character not found');
        if (!successful) return "Sorry, try again";
    

        const resourceKey = `Tier${tier}ResourceA`;
        if (character.inventory[resourceKey]) {
          character.inventory[resourceKey] += 1;
        } else {
          character.inventory[resourceKey] = 1;
        }
        character.markModified('inventory');
    
        character.progress.gatherings += 1;
        character.experience += tier;
    
        await character.save();
    
        return `Gathering task completed successfully! Gained Tier ${tier} Resource A.`;
      } catch (error) {
        throw new Error(`Error completing gathering task: ${error.message}`);
      }
    }
    
    ,
    
    completeMobBattle: async (_, { characterId, tier, successful }) => {
      try {
        const character = await Character.findById(characterId);
        if (!character) throw new Error('Character not found');
    
        if (!successful) return "You have been defeated";
    
        const resourceKey = `Tier${tier}ResourceB`;
    
        if (character.inventory[resourceKey]) {
          character.inventory[resourceKey] += 1;
        } else {
          character.inventory[resourceKey] = 1;
        }
    
        character.markModified('inventory');
        character.progress.mobsKilled += 1;
        character.experience += tier * 2;
    
        await character.save();
    
        return `Mob battle completed successfully! Gained Tier ${tier} Resource B.`;
      } catch (error) {
        throw new Error(`Error completing mob battle: ${error.message}`);
      }
    }
    ,
    

    completeBossBattle: async (_, { characterId, tier, successful }) => {
      try {
        const character = await Character.findById(characterId);
        if (!character) throw new Error('Character not found');
    
        if (!successful) return "You have been defeated";
    
        const resourceKey = `Tier${tier}ResourceC`;
    
        if (character.inventory[resourceKey]) {
          character.inventory[resourceKey] += 1;
        } else {
          character.inventory[resourceKey] = 1;
        }
    
        character.markModified('inventory');
        character.progress.questsCompleted += 1;
        character.progress.mobsKilled += 1; 
        character.experience += tier * 5;
        character.gold += tier * 100;
        character.score += tier;
    
        await character.save();
    
        return `Boss battle completed successfully! Gained Tier ${tier} Resource C.`;
      } catch (error) {
        throw new Error(`Error completing boss battle: ${error.message}`);
      }
    }
    ,
    

    purchasePotion: async (_, { characterId, tier }) => {
      try {
        const character = await Character.findById(characterId);
        if (!character) throw new Error('Character not found');
    
        const potionPrice = tier * 50;
    
        if (character.gold < potionPrice) {
          return "Not enough gold to purchase potion";
        }
    
        character.gold -= potionPrice;
        character.potionBag[`tier${tier}`] += 1;
    
        character.markModified('potionBag');
        await character.save();
    
        return `Potion purchased successfully! Tier ${tier} potion added to potion bag.`;
      } catch (error) {
        throw new Error(`Error purchasing potion: ${error.message}`);
      }
    },
    

    upgradeGear: async (_, { characterId, gearType, tier }) => {
      try {
        const character = await Character.findById(characterId);
        if (!character) throw new Error('Character not found');
    
        if (character.armor[gearType] >= tier) {
          return `The ${gearType} is already at Tier ${character.armor[gearType]} or higher. No upgrade needed.`;
        }
        
        // Define resource keys
        const resourceAKey = `Tier${tier}ResourceA`;
        const resourceBKey = `Tier${tier}ResourceB`;
        const resourceCKey = tier > 1 ? `Tier${tier - 1}ResourceC` : null;
    
        // Check if character has enough resources
        if (
          character.inventory[resourceAKey] < 20 ||
          character.inventory[resourceBKey] < 20 ||
          (resourceCKey && character.inventory[resourceCKey] < 20)
        ) {
          return "Not enough resources to upgrade gear";
        }
    
        // Deduct resources
        character.inventory[resourceAKey] -= 20;
        character.inventory[resourceBKey] -= 20;
        if (resourceCKey) {
          character.inventory[resourceCKey] -= 20;
        }
    
        character.markModified('inventory');
    
        // Upgrade gear
        character.armor[gearType] = tier;
        character.markModified('armor');
    
        await character.save();
    
        return `Gear upgraded successfully! ${gearType} is now Tier ${tier}.`;
      } catch (error) {
        throw new Error(`Error upgrading gear: ${error.message}`);
      }
    }    
    
  },
};

export default resolvers;
