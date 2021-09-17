const express = require('express');
const auth = require("../middleware/auth");
const userAuthCache = require("../model/user_auth_cache");
const user = require("../model/mongo/user");
const userChanges = require("../model/mongo/user_changes");
const router = express.Router();
const userUtil = require("../model/user_util");

/**
 * A method that validates that a user info body is correct (checking for all mandatory fields)
 * @param req The request to validate
 * @return {Promise<user>} The body (user)
 */
function validateUserInfoReq(req) {
    return new Promise((resolve, reject) => {
        let userInfo = req.body;

        if (!userInfo) {
            reject('Missing request body');
        } else {
            // Check for mandatory properties, the rest (phone and address) are optional
            for (let prop of ['email', 'firstName', 'lastName', 'dateOfBirth', 'maritalStatus']) {
                if (!userInfo[prop]) {
                    reject(`Missing mandatory field: ${prop}`);
                    return;
                }
            }

            resolve(userInfo);
        }
    });
}

/**
 * A method that accepts two user models, and collect the changes between them,
 * to store into userchanges collection.
 * @param existingUser The existing user (which we'll keep its data in userchanges)
 * @param newUser The new information
 * @return {*[]} changes
 */
function collectChanges(existingUser, newUser) {
    let changes = [];

    for (let prop of ['email', 'firstName', 'lastName', 'phoneNumber', 'maritalStatus']) {
        if (existingUser[prop] !== newUser[prop]) {
            changes.push({propertyName: prop, propertyValue: existingUser[prop]});
        }
    }

    if (new Date(existingUser.dateOfBirth).getTime() !== new Date(newUser.dateOfBirth).getTime()) {
        changes.push({
            propertyName: 'dateOfBirth',
            propertyValue: existingUser.dateOfBirth
        });
    }

    if (JSON.stringify(existingUser.address) !== JSON.stringify(newUser.address)) {
        changes.push({propertyName: 'address', propertyValue: existingUser.address});
    }

    return changes;
}

router.put('/signup', auth, function (req, res) {
    user.create({firebaseUserId: req.userId, email: req.userEmail, version: 1})
        .then(user => res.status(200).json(userUtil.toPublicUser(user)))
        .catch((error) => res.status(500).json({message: error}));
});

router.post('/signout', auth, function (req, res) {
    userAuthCache.remove(req.jwt);
    res.status(200).json({message: 'Signed Out'});
});

// GET user by id.
// userId is accessible through req.params.userId
router.get('/info', auth, function (req, res) {
    user.findOne({firebaseUserId: req.userId})
        .exec()
        .then(user => res.status(200).json(userUtil.toPublicUser(user)))
        .catch(() => res.status(404).json({message: 'NOT FOUND'}));
});

router.post('/info', auth, function (req, res) {
    validateUserInfoReq(req)
        .then(() => {
            return user.findOne({firebaseUserId: req.userId}).exec();
        })
        .then(user => {
            let update = userUtil.toPrivateUser(req.body, req.userId, user.version);
            let changes = collectChanges(user, update);

            // Update only if there is a difference
            if (changes.length > 0) {
                let userChangesEntity = {
                    firebaseUserId: req.userId,
                    changes: changes,
                    version: user.version,
                    updateDate: new Date()
                }

                return userChanges.create(userChangesEntity);
            } else {
                // Break promise chain
                throw new Error('Nothing to update');
            }
        })
        .then(updatedUserChange => {
            let update = userUtil.toPrivateUser(req.body, req.userId, updatedUserChange.version + 1);
            return user.updateOne({firebaseUserId: req.userId}, update).exec();
        })
        .then(updatedUser => res.status(200).json(userUtil.toPublicUser(updatedUser)))
        .catch((error) => {
            let statusCode = 400;

            if (error.message === 'Nothing to update') {
                statusCode = 200;
            }

            res.status(statusCode).json({message: error.message});
        });
});

module.exports = router;
