import { Schema, model } from 'mongoose';

const characterSchema = new Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  health: { type: Number, required: true },
  castingResource: { type: Number, required: true },
  power: { type: Number, required: true },
  defense: { type: Number, required: true },
  preparedness: { type: Number, required: true },
  inventory: { type: Object, default: {} },
  armor: {
    helmet: { type: Number, required: true },
    chestpiece: { type: Number, required: true },
    leggings: { type: Number, required: true },
    boots: { type: Number, required: true },
    gloves: { type: Number, required: true },
  },
});

export default model('Character', characterSchema);
