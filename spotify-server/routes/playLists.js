const router = require("express").Router();
const { PlayList, validate } = require("../models/playList");
const { Song } = require("../models/song");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const Joi = require("joi");

// create playlist
router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const user = await User.findById(req.user._id);
    const playList = new PlayList({ ...req.body, user: user._id });
    await playList.save();
    user.playlists.push(playList._id);
    await user.save();

    res.status(201).send({ data: playList });
});

// edit playlist by id
router.put("/edit/:id", [validateObjectId, auth], async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        desc: Joi.string().allow(""),
        img: Joi.string().allow(""),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const playlist = await PlayList.findById(req.params.id);
    if (!playlist) return res.status(404).send({ message: "Playlist not found" });

    const user = await User.findById(req.user._id);
    if (!user._id.equals(playlist.user))
        return res.status(403).send({ message: "User does not have access to edit this playlist!" });

    playlist.name = req.body.name;
    playlist.desc = req.body.desc;
    playlist.img = req.body.img;
    await playlist.save();

    res.status(200).send({ message: "Updated successfully" });
});

// add song to playlist
router.put("/add-song", auth, async (req, res) => {
    const schema = Joi.object({
        playlistId: Joi.string().required(),
        songId: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const user = await User.findById(req.user._id);
    const playlist = await PlayList.findById(req.body.playlistId);
    if (!user._id.equals(playlist.user))
        return res.status(403).send({ message: "User does not have access to add songs to this playlist!" });

    if (playlist.songs.indexOf(req.body.songId) === -1) {
        playlist.songs.push(req.body.songId);
    }
    await playlist.save();
    res.status(200).send({ data: playlist, message: "Added to playlist" });
});

// remove song from playlist
router.put("/remove-song", auth, async (req, res) => {
    const schema = Joi.object({
        playlistId: Joi.string().required(),
        songId: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const user = await User.findById(req.user._id);
    const playlist = await PlayList.findById(req.body.playlistId);
    if (!user._id.equals(playlist.user))
        return res.status(403).send({ message: "User does not have access to remove songs from this playlist!" });

    const index = playlist.songs.indexOf(req.body.songId);
    playlist.songs.splice(index, 1);
    await playlist.save();
    res.status(200).send({ data: playlist, message: "Removed from playlist" });
});

// user playlists (only admin playlists should be visible to everyone)
router.get("/favourite", auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    const playlists = await PlayList.find({ _id: { $in: user.playlists } });
    res.status(200).send({ data: playlists });
});

// get random playlists (only admin playlists should be visible to everyone)
router.get("/random", auth, async (req, res) => {
    const playlists = await PlayList.find({}).populate("user", "isAdmin"); // Assume PlayList has a reference to User
    const adminPlaylists = playlists.filter(playlist => playlist.user.isAdmin);
    res.status(200).send({ data: adminPlaylists });
});

// get playlist by id
router.get("/:id", [validateObjectId, auth], async (req, res) => {
    const playlist = await PlayList.findById(req.params.id);
    if (!playlist) return res.status(404).send("Not found");

    const songs = await Song.find({ _id: { $in: playlist.songs } });
    res.status(200).send({ data: { playlist, songs } });
});

// get all playlists (only admin playlists should be visible to everyone)
router.get("/", auth, async (req, res) => {
    const playlists = await PlayList.find().populate("user", "isAdmin");
    const adminPlaylists = playlists.filter(playlist => playlist.user.isAdmin);
    res.status(200).send({ data: adminPlaylists });
});

// delete playlist by id
router.delete("/:id", [validateObjectId, auth], async (req, res) => {
    const user = await User.findById(req.user._id);
    const playlist = await PlayList.findById(req.params.id);
    if (!user._id.equals(playlist.user))
        return res.status(403).send({ message: "User does not have access to delete this playlist!" });

    const index = user.playlists.indexOf(req.params.id);
    user.playlists.splice(index, 1);
    await user.save();
    await playlist.remove();
    res.status(200).send({ message: "Removed from library" });
});

module.exports = router;
