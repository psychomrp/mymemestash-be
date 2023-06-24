// imports
const Stashes = require('../models/Stashes');
const randomstring = require('randomstring');
const { upload } = require('../cloudinary');

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

const uploadUserStash = async (req, res) => {
    const userId = req.userId;
    const stashCode = req.params.stash_code;

    const checkThatStashBelongsToUser = await Stashes.checkThatStashBelongsToUser(userId, stashCode);

    if(!checkThatStashBelongsToUser) {
        return res.status(400).json({error: 'Permission denied'});
    }

    const files = req.files;

    // Define the allowed file types (images, gifs, and short videos)
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/quicktime', 'video/mp4'];

    // Array to store the uploaded file metadata
    const items = [];

    // Loop through each uploaded file
    for (const file of files) {
        const public_id = randomstring.generate(10);
        const fileSizeInBytes = file.size;
        const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

        // Check if the file type is allowed
        if (allowedFileTypes.includes(file.mimetype)) {
            try {
                // Upload the file to Cloudinary
                const result = await upload(file, public_id);
                // Store the file metadata in the 'items' object
                items.push({
                    file_type: file.mimetype,
                    file_size: fileSizeInMB,
                    public_id: public_id,
                    urls: {
                        original: result.original,
                        compressed: result.compressed
                    },
                    original_filename: result.original_filename,
                });
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    }

    // Update Stash with items
    await Stashes.updateStash(stashCode, {
        items: JSON.stringify(items)
    });

    // Respond with the uploaded file metadata
    res.json({message: 'Stash files uploaded', items: items });
}

const fetchSingleUserStash = async (req, res) => {
    const userId = req.userId;
    const stashCode = req.params.stash_code;

    const checkThatStashBelongsToUser = await Stashes.checkThatStashBelongsToUser(userId, stashCode);

    if(!checkThatStashBelongsToUser) {
        return res.status(400).json({error: 'Permission denied'});
    }

    try {
        const singleStash = await Stashes.getStashByCode(stashCode);
        return res.status(200).json(singleStash);
    } catch (error) {
        console.log(error)
        return res.status(400).json({error: 'Failed to fetch stash, try again'});
    }
}

module.exports = {
    fetchUserStash,
    createUserStash,
    editUserStash,
    deleteUserStash,
    uploadUserStash,
    fetchSingleUserStash
}