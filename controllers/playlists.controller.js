const asyncHandler = require("express-async-handler");
const playlistModel = require("../models/playlists.model");
const usersModel = require("../models/users.model");

exports.createPlaylist = asyncHandler(async (req, res) => {
    // data format check
    const { name, musics } = req.body;
    const { id:owner } = req.user;
    if (!musics || !JSON.parse(musics) || !name  || !owner) throw {
        message: "missing data",
        status: 400
    }
    const content = JSON.parse(musics);
    // Add the playlist
    const newPlaylist = await playlistModel.create({ name, content, owner });
    if (!newPlaylist) throw new Error("Error while adding playlist, please try again later");
    res.status(200).json({
        status: `Playlist ${newPlaylist.name} successfully created!`,
        id: newPlaylist.id,
    })
})

exports.getPlaylist = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw {
        message: "missing playlist id",
        status: 400
    }
    const playlist = await playlistModel.findOne({ _id: id });
    if (!playlist) throw {
        message: "playlist not found",
        status: 404
    }
    const { username:owner } = await usersModel.findById(playlist.owner);
    res.status(200).json({
        name: playlist.name,
        owner,
        content: playlist.content
    })
})

exports.updatePlaylist = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, musics } = req.body;
    const { _id:owner } = req.user;
    if (!musics || !JSON.parse(musics) || !name  || !owner || !id) throw {
        message: "Missing data",
        status: 400
    }
    const { owner:playlistOwner } = await playlistModel.findOne({ _id: id });
    if (!playlistOwner || !owner.equals(playlistOwner)) throw {
        message: "Your are not authorized to edit this!",
        status: 401
    }
    const content = JSON.parse(musics);
    if (!Array.isArray(content) || content.length < 1) throw {
        message: "Invalid musics",
        status: 400
    }
    // update the playlist
    const updatedPlaylist = await playlistModel.findByIdAndUpdate(id, { name, content, owner });
    if (!updatedPlaylist) throw new Error("Error while adding playlist, please try again later");
    res.status(200).json({
        status: `Playlist ${name} successfully updated!`,
        id: updatedPlaylist.id,
    })
})

exports.deletePlaylist = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id)
    const { _id:userId } = req.user;
    if (!id) throw {
        message: "Missing playlist",
        status: 400
    }
    const { owner } = await playlistModel.findOne({ _id: id });
    if (!owner || !userId.equals(owner)) throw {
        message: "Your are not authorized to edit this!",
        status: 401
    }
    /* --------------------------------- DELETE --------------------------------- */
    const query = await playlistModel.deleteOne({ _id: id });
    if (query.deletedCount !== 1) throw new Error(query);
    res.status(200).json({
        deleted: id
    });
})
