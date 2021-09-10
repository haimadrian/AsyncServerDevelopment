const jwtUtils = require("../model/jwt_util");
require('mocha');
const {escapeRegExp} = require('lodash');
const expect = require('chai').expect;

process.env.TOKEN_KEY = "abcdefg";
const userId = 'haim@gmail.com';
const expectedJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJ1c2VySWQiOiJoYWltQGdtYWlsLmNvbSIsImlhdCI6MTYzMTIz';
const jwt = expectedJwt + 'MjcxMiwiZXhwIjoxNjMxMjM5OTEyfQ.TXlQPIlbfa1maGdBIylfkdyOkVx1ObIxf8FitrlHvA0';

describe('Test JwtUtils', function () {
    it('JWT signing', async function () {
        // Return the Promise, so Mocha will handle async test
        return jwtUtils.sign(userId).then(jwtValue => {
            expect(jwtValue).to.be.a('string')
                .and.matches(new RegExp('^' + escapeRegExp(expectedJwt)),
                'Wrong JWT signing');
        });
    });

    it('JWT verification', async function () {
        // Return the Promise, so Mocha will handle async test
        return jwtUtils.verify(jwt).then(claims => {
            expect(claims.userId).to.equal(userId, 'Wrong JWT verification');
        });
    });
});
