require('jest');
const jwtUtils = require("../../model/jwt_util");
const userAuthCache = require("../../model/user_auth_cache");
const request = require('supertest');
const app = require('../../app');

process.env.TOKEN_KEY = "abcdefg";
const userId = 'haim@gmail.com';

describe('Test /auth APIs', () => {
    let server;

    // Called once before any of the tests in this block begin.
    beforeAll(function (done) {
        server = app.listen(function (err) {
            if (err) {
                return done(err);
            }

            done();
        });
    });

    it('Validate a JWT without Authorization Header should fail', async () => {
        // Act
        const res = await request(app).get('/auth/isvalid');

        // Assert
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(new RegExp('authorization'));
    });

    it('Validate a valid JWT', async () => {
        return jwtUtils.sign(userId).then(async jwt => {
            // Arrange
            userAuthCache.put(userId, jwt);

            // Act
            const res = await request(app)
                .get('/auth/isvalid')
                .set('Authorization', 'Bearer ' + jwt);

            // Assert
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toEqual('200 OK');
        });
    });

    it('Validate a malformed JWT', async () => {
        // Act
        const res = await request(app)
            .get('/auth/isvalid')
            .set('Authorization', 'Bearer invalid jwt');

        // Assert
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Invalid Token');
    });

    it('Validate an expired JWT', async () => {
        // Arrange
        const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
            'eyJ1c2VySWQiOiJoYWltQGdtYWlsLmNvbSIsImlhdCI6MTYzMTM1NjEzNCwiZXhwIjoxNjMxMzYzMzM0fQ.' +
            'F9tooNPm-T7AoOy_x_1uwpHYF3Kxa6VFyKo_m4GeSRw';

        // Act
        const res = await request(app)
            .get('/auth/isvalid')
            .set('Authorization', 'Bearer ' + jwt);

        // Assert
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Invalid Token');
    });

    afterAll(async () => server.close());
});