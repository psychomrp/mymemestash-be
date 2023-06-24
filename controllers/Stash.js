// imports
const Stashes = require('../models/Stashes');
const randomstring = require('randomstring');

// functions
const fetchUserStash = async (req, res) => {
    const userId = req.userId;

    const stashes = await Stashes.getStashesByUserId(userId);

    return res.status(200).json({stashes});
}

const createUserStash = async (req, res) => {
    const userId = req.userId;
    const stashCode = randomstring.generate(10);

    const stashData = {
        user_id: userId,
        stash_code: stashCode,
        title: req.body.title,
        tags: JSON.stringify(req.body.tags),
        privacy: req.body.privacy
    };

    const storeData = await Stashes.createStash(stashData);

    if(!storeData) {
        return res.status(400).json({error: 'Failed to create stash, try again'});
    }

    return res.status(200).json({message: 'User stash created'})
}

const editUserStash = async (req, res) => {
    const userId = req.userId;
    const stashCode = req.body.stash_code;

    const checkThatStashBelongsToUser = await Stashes.checkThatStashBelongsToUser(userId, stashCode);

    if(!checkThatStashBelongsToUser) {
        return res.status(400).json({error: 'Permission denied'});
    }

    const updateData = {
        title: req.body.title,
        tags: JSON.stringify(req.body.tags),
        privacy: req.body.privacy
    };

    try {
        await Stashes.updateStash(stashCode, updateData);
    } catch (error) {
        console.log(error)
        return res.status(400).json({error: 'Failed to update stash, try again'});
    }

    return res.status(200).json({message: 'User stash updated'});
}

const deleteUserStash = async (req, res) => {
    const userId = req.userId;
    const stashCode = req.body.stash_code;

    const checkThatStashBelongsToUser = await Stashes.checkThatStashBelongsToUser(userId, stashCode);

    if(!checkThatStashBelongsToUser) {
        return res.status(400).json({error: 'Permission denied'});
    }

    try {
        await Stashes.deleteStash(stashCode);
    } catch (error) {
        console.log(error)
        return res.status(400).json({error: 'Failed to delete stash, try again'});
    }

    return res.status(200).json({message: 'User stash deleted'});
}

module.exports = {
    fetchUserStash,
    createUserStash,
    editUserStash,
    deleteUserStash
}