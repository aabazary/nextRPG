import { Schema, model } from 'mongoose';

const characterSchema = new Schema({
  name: { type: String, required: true },
  class: { type: String, required: true, enum: ['Hunter', 'Warrior', 'Mage'] },
  inventory: { type: Object, default: {} },
  gold: { type: Number, default: 0 },
  armor: {
    helmet: { type: Number, required: true },
    chestPiece: { type: Number, required: true },
    leggings: { type: Number, required: true },
    boots: { type: Number, required: true },
    gloves: { type: Number, required: true },
  },
  progress: {
    mobsKilled: { type: Number, default: 0 },
    questsCompleted: { type: Number, default: 0 },
    gatherings: { type: Number, default: 0 }
  },
  potionBag: {
    tier1: { type: Number, default: 0 },
    tier2: { type: Number, default: 0 },
    tier3: { type: Number, default: 0 },
    tier4: { type: Number, default: 0 },
    tier5: { type: Number, default: 0 },
    tier6: { type: Number, default: 0 },
    tier7: { type: Number, default: 0 },
    tier8: { type: Number, default: 0 },
    tier9: { type: Number, default: 0 },
    tier10: { type: Number, default: 0 }
  },  
  experience: { type: Number, default: 0 },
  score: { type: Number, default: 0 }
});

characterSchema.virtual('level').get(function () {
  const thresholds = [0, 100, 500, 1500];
  let level = thresholds.length;

  for (let i = 0; i < thresholds.length; i++) {
    if (this.experience < thresholds[i]) {
      level = i;
      break;
    }
  }

  if (level === thresholds.length) {
    level += Math.floor((this.experience - thresholds[thresholds.length - 1]) / 2000);
  }

  return level;
});

characterSchema.virtual('health').get(function () {
  const baseHealth = 10;
  const armorMultiplier = [0, 20, 100, 500];
  const classMultiplier = {
    Mage: 1,
    Hunter: 1.5,
    Warrior: 2
  };

  const levelContribution = (this.level - 1) * 10;
  const armorContribution = Object.values(this.armor).reduce((total, tier) => {
    return total + (armorMultiplier[tier] || 0);
  }, 0);

  const classMultiplierValue = classMultiplier[this.class] || 1;
  return (baseHealth + armorContribution + levelContribution) * classMultiplierValue;
});

characterSchema.virtual('castingResource').get(function () {
  return 100 + (this.level - 1) * 10;
});

characterSchema.virtual('preparedness').get(function () {
  const tiers = Object.values(this.armor);
  const lowestTier = Math.min(...tiers);
  return lowestTier * 10;
});


characterSchema.virtual('power').get(function () {
  return this.level + this.preparedness;
});


export default model('Character', characterSchema);
