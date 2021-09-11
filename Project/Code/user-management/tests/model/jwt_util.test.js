require('jest');
const jwtUtils = require("../../model/jwt_util");
const {escapeRegExp} = require('lodash');

process.env.TOKEN_KEY = "abcdefg";
const userId = 'haim@gmail.com';
const expectedJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJoYWltQGdtYWlsLmNvbSIs';
const jwt = expectedJwt + 'ImlhdCI6MTYzMTM1NjEzNCwiZXhwIjoxNjMxMzYzMzM0fQ.F9tooNPm-T7AoOy_x_1uwpHYF3Kxa6VFyKo_m4GeSRw';

describe('Test JwtUtils', function () {
    it('JWT signing', async function () {
        // Return the Promise, so Mocha will handle async test
        return jwtUtils.sign(userId).then(jwtValue => {
            expect(typeof jwtValue).toBe('string');
            expect(jwtValue).toMatch(new RegExp('^' + escapeRegExp(expectedJwt)));
        });
    });

    it('JWT verification', async function () {
        // Return the Promise, so Mocha will handle async test
        return jwtUtils.verify(jwt)
            .then(claims => {
                expect(claims.userId).toEqual(userId);
            })
            .catch(error => {
                // Only TokenExpiredError is expected here.
                expect(error.name).toEqual('TokenExpiredError');
            });
    });
});
