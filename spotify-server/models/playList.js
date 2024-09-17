const mongoose = require("mongoose");
const Joi = require("joi");

const playListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  desc: { type: String },
  songs: { type: [mongoose.Schema.Types.ObjectId], ref: "song", default: [] },
  img: { type: String },
  isPublic: { type: Boolean, default: false }, // Add this field
});

const validate = (playList) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    user: Joi.string().required(),
    desc: Joi.string().allow(""),
    songs: Joi.array().items(Joi.string()),
    img: Joi.string().allow(""),
    isPublic: Joi.boolean() // Add this field to validation
  });
  return schema.validate(playList);
};

const PlayList = mongoose.model("playList", playListSchema);

module.exports = { PlayList, validate };
