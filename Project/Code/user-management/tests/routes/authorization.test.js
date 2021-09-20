require('jest');
const request = require('supertest');
const app = require('../../app');

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
        const res = await request(app).get('/auth');

        // Assert
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch(new RegExp('authorization'));
    });

    it('Validate a valid JWT', async () => {
        // Arrange
        const jwt = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyYWZkYjliOGJmZmMyY2M4ZTU4NGQ' +
            '2ZWE2ODlmYzEwYTg3MGI2NzgiLCJ0eXAiOiJKV1QifQ.' +
            'eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZXhwZW5zZWFwcGhpdCIs' +
            'ImF1ZCI6ImV4cGVuc2VhcHBoaXQiLCJhdXRoX3RpbWUiOjE2MzE0NTAzOTQsInVzZXJfaWQi' +
            'OiJ6NUhFUXdhR05sYWl4aWN5OEx4QWg5a3NuWU8yIiwic3ViIjoiejVIRVF3YUdObGFpeGlj' +
            'eThMeEFoOWtzbllPMiIsImlhdCI6MTYzMTQ1MDM5NSwiZXhwIjoxNjMxNDUzOTk1LCJlbWFp' +
            'bCI6ImhhaW1AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6' +
            'eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImhhaW1AZ21haWwuY29tIl19LCJzaWduX2luX3By' +
            'b3ZpZGVyIjoicGFzc3dvcmQifX0.' +
            'XlfMKOmt8bAuGsVcdQJ9JNBN3UaggmdAbRwz-VuEp_xbdShv8SF1MNURsBI2DK9pMv4M420o' +
            'Vk0mErOyHZ8Fk8sDnYUOxC37CrvY-qsGhTPRtp3h37Rp08NFjE2iNfjbeu4vNwMe8lhTn4OV' +
            'bDABdG0MCEQMJeAIF6XYH9hMEk4BjlKW6fGX96dzJ9mewXMds6oAZ4WHS4LdpgQgpo03lS6V' +
            'cE41hhQHqusZdo6NENkoaagJxfkH609m4O5en6U8xfcsB9syOgClB3xnk0tf-KEEkBcfjeqB' +
            'DP0MUz3tksONdwKNQSLmImYpDnDdxKLfwfaEY3o8TPfUUy_X8JuuDw';

        // Act - Commented out to avoid of sending redundant requests to firebase
        const res = await request(app)
            .get('/auth')
            .set('Authorization', 'Bearer ' + jwt);

        // Assert
        expect(res.statusCode === 200 || res.statusCode === 403).toBeTruthy();
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).not.toEqual('Invalid Token');
    });

    it('Validate a malformed JWT', async () => {
        // Act
        const res = await request(app)
            .get('/auth')
            .set('Authorization', 'Bearer invalid jwt');

        // Assert
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Invalid Token');
    });

    afterAll(async () => server.close());
});