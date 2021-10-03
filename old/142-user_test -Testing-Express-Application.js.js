const request = require('supertest')
const app = require('../src/app')

test('Should sign up a new user', async () => {
    // Call supertest and pass in app. Can configure get/post/delete etc. Pass in URL
    // Then pass in an object to send data
    // Then we chain on the expect
    await request(app).post('/users').send({
        name: 'Andrew',
        email: 'andrew@example.com',
        password: 'MyPass777!'
    }).expect(201)
})