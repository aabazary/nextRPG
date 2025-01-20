import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  activeCharacter:{ type: Schema.Types.ObjectId, ref: 'Character' },
  characters: [{ type: Schema.Types.ObjectId, ref: 'Character' }]
});

export default model('User', userSchema);
