import User from "../models/User";
import Character from "../models/Character.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import context from "@/utils/auth";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const resolvers = {
  Query: {
    getUser: async (_, { id }) => {
      try {
        return await User.findById(id).populate('characters');
      } catch (error) {
        throw new Error('User not found');
      }
    },

    getCharacter: async (_, { id }) => {
      try {
        return await Character.findById(id);
      } catch (error) {
        throw new Error('Character not found');
      }
    },

    getAllUsers: async () => {
      try {
        return await User.find().populate('characters');
      } catch (error) {
        throw new Error('Error fetching users');
      }
    },

    getAllCharacters: async () => {
      try {
        return await Character.find();
      } catch (error) {
        throw new Error('Error fetching characters');
      }
    },

    me: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Authorization header missing');
      }

      const user = await User.findById(context.user.userId).populate('characters activeCharacter');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    },
  
    topByExperience: async () => {
      try {
        const characters = await Character.find()
          .sort({ experience: -1 }) 
          .limit(5); 
        return characters;
      } catch (error) {
        throw new Error(`Error fetching top characters by experience: ${error.message}`);
      }
    },
    topByScore: async () => {
      try {
        const characters = await Character.find()
          .sort({ score: -1 }) 
          .limit(5);
        return characters;
      } catch (error) {
        throw new Error(`Error fetching top characters by score: ${error.message}`);
      }
    },
    topByMobsKilled: async () => {
      try {
        const characters = await Character.find()
          .sort({ "progress.mobsKilled": -1 })
          .limit(5);
        return characters;
      } catch (error) {
        throw new Error(`Error fetching top characters by mobs killed: ${error.message}`);
      }
    },
    topByQuestsCompleted: async () => {
      try {
        const characters = await Character.find()
          .sort({ "progress.questsCompleted": -1 }) 
          .limit(5);
        return characters;
      } catch (error) {
        throw new Error(`Error fetching top characters by quests completed: ${error.message}`);
      }
    },
    topByGathering: async () => {
      try {
        const characters = await Character.find()
          .sort({ "progress.gatherings": -1 })
          .limit(5);
        return characters;
      } catch (error) {
        throw new Error(`Error fetching top characters by gathering: ${error.message}`);
      }
    },
    topUsersByScore: async () => {
      try {
        const users = await User.find(); 
        const userScores = await Promise.all(
          users.map(async (user) => {
            const characters = await Character.find({ _id: { $in: user.characters } });
    
            const totalScore = characters.reduce((sum, char) => sum + (char.score || 0), 0);
    
            return { username: user.username, totalScore };
          })
        );
        return userScores.sort((a, b) => b.totalScore - a.totalScore).slice(0, 5);
      } catch (error) {
        throw new Error(`Error fetching top users by combined score: ${error.message}`);
      }
    },
    
    classDistribution: async () => {
      try {
        const warriors = await Character.countDocuments({ class: 'Warrior' });
        const mages = await Character.countDocuments({ class: 'Mage' });
        const hunters = await Character.countDocuments({ class: 'Hunter' });
    
        return { warriors, mages, hunters };
      } catch (error) {
        throw new Error(`Error fetching class distribution: ${error.message}`);
      }
    },
    
  
  },

  Mutation: {
    signup: async (_, { email,username, password }) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error('User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email,username, password: hashedPassword });
        await newUser.save();

        const token =  jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

        return {user:newUser,token};
      } catch (error) {
        throw new Error(error.message);
      }
    },


    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) throw new Error('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        return {
          token, 
          user,  
        };
      } catch (error) {
        throw new Error('Error logging in');
      }
    },


    createCharacter: async (_, { userId, name, class: characterClass }) => {
      try {

        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
    
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
    
        await newCharacter.save();
    
        user.characters.push(newCharacter);
        await user.save();
    
        return newCharacter;
      } catch (error) {
        throw new Error(`Error creating character: ${error.message}`);
      }
    },
    

    deleteCharacter: async (_, { characterId }) => {
      try {
        const character = await Character.findByIdAndDelete(characterId);
        if (!character) throw new Error('Character not found');

        return 'Character deleted successfully';
      } catch (error) {
        throw new Error('Error deleting character');
      }
    },
    setActiveCharacter: async (_, { characterId }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      const user = await User.findById(context.user.userId).populate('characters');
      if (!user) {
        throw new Error('User not found');
      }
    
      const characterExists = user.characters.some(
        (character) => character._id.toString() === characterId
      );
    
      if (!characterExists) {
        throw new Error('Character not found in user\'s character list');
      }
    
      user.activeCharacter = characterId;
      await user.save();
    
      return user; 
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
    
    
    purchasePotion: async (_, { characterId, tier, quantity }) => {
      try {
        const character = await Character.findById(characterId);
        if (!character) throw new Error('Character not found');
    
        const potionPrice = tier * 50 * quantity;
    
        if (character.gold < potionPrice) {
          return `Not enough gold to purchase ${quantity} Tier ${tier} potion(s)`;
        }
    
        character.gold -= potionPrice;
        character.potionBag[`tier${tier}`] += quantity;
    
        character.markModified('potionBag');
        await character.save();
    
        return `Purchase successful! Added ${quantity} Tier ${tier} potion(s) to potion bag.`;
      } catch (error) {
        throw new Error(`Error purchasing potion: ${error.message}`);
      }
    },
    
    usePotion: async (_, { characterId, tier }) => {
      try {
        const character = await Character.findById(characterId);
        if (!character) throw new Error("Character not found");
    
        const potionKey = `tier${tier}`;
    
        if (!character.potionBag[potionKey] || character.potionBag[potionKey] <= 0) {
          return `No Tier ${tier} potions available to use.`;
        }
    
        character.potionBag[potionKey] -= 1;
    
        character.markModified("potionBag");
        await character.save();
    
        return `Potion used successfully! Tier ${tier} potion has been consumed.`;
      } catch (error) {
        throw new Error(`Error using potion: ${error.message}`);
      }
    },
    

    upgradeGear: async (_, { characterId, gearType, tier }) => {
      try {
        const character = await Character.findById(characterId);
        if (!character) throw new Error('Character not found');
    
        if (character.armor[gearType] >= tier) {
          return `The ${gearType} is already at Tier ${character.armor[gearType]} or higher. No upgrade needed.`;
        }
        
        const resourceAKey = `Tier${tier}ResourceA`;
        const resourceBKey = `Tier${tier}ResourceB`;
        const resourceCKey = `Tier${tier}ResourceC`;
    
        if (
          character.inventory[resourceAKey] < 20 ||
          character.inventory[resourceBKey] < 20 ||
          character.inventory[resourceCKey] < 20
        ) {
          return "Not enough resources to upgrade gear";
        }

        character.inventory[resourceAKey] -= 20;
        character.inventory[resourceBKey] -= 20;
        character.inventory[resourceCKey] -= 20;
     
    
        character.markModified('inventory');
    
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
