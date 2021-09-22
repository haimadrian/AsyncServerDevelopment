/**
 * Use this function to convert some user object (specifically a mongo user document)
 * to a user we send to client. This way we hide mongo data, such as _id, when
 * there is no 'projections' functionality in mongoose.
 * @param user The user to convert
 * @return A user for client
 */
exports.toPublicUser = function(user) {
    return {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        maritalStatus: user.maritalStatus,
        version: user.version,
        address: {
            street: user.address?.street,
            city: user.address?.city,
            state: user.address?.state,
            postalCode: user.address?.postalCode,
            country: user.address?.country
        }
    };
}

/**
 * Use this function to convert some user object (specifically a user we get from client)
 * to a user we save to mongo. This way we disallow unexpected properties.
 * @param user The user to convert
 * @param firebaseUserId uid from Firebase
 * @param version The version of the user document
 * @return A user for mongo
 */
exports.toPrivateUser = function(user, firebaseUserId, version) {
    return {
        firebaseUserId: firebaseUserId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber ? user.phoneNumber : user.phone,
        dateOfBirth: user.dateOfBirth,
        maritalStatus: user.maritalStatus,
        version: version,
        address: {
            street: user.address?.street,
            city: user.address?.city,
            state: user.address?.state,
            postalCode: user.address?.postalCode,
            country: user.address?.country
        }
    };
}