const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId() // We create the user id here with this
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

// Use for setup - pass in function as argument that runs before each test in test suite
beforeEach(async () => {
    await User.deleteMany() // This deletes all users from database
    await new User(userOne).save() // This adds in same user to database
})

test('Should sign up a new user', async () => {
    // Save response as variable to access parts of it
    const response = await request(app).post('/users').send({
        name: 'Andrew',
        email: 'andrew@example.com',
        password: 'MyPass777!'
    }).expect(201)

    // Assert that database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    // toMatchObject must contain at least what we specify - can contain more
    expect(response.body).toMatchObject({
        user: {
            name: 'Andrew',
            email: 'andrew@example.com'
        },
        token: user.tokens[0].token
    })
    // Checking password is not stored
    expect(user.password).not.toBe('MyPass777!')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId) // Fetch user from DB directly

    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non-existent user', async () => {
    await request(app).post('/users/login').send({
        email: 'joke@example.com',
        password: 'Why123456!!'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) // Authorization header
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user with authentication', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) // Authorization header
        .send()
        .expect(200)

    // Assert that user removed from database
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg') // 2 strings - first is form field, second is path to file from root of project
        .expect(200)

    const user = await User.findById(userOneId)
    // expect({}).toBe({})
    // This statement won't work (uses the === operator)
    // It is looking for them to be the same object in memory. We can use toEqual
    expect(user.avatar).toEqual(expect.any(Buffer)) // We are checking we have saved buffer data
})

test('Should update valid user fields', async () => {
    response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: 'Dave' })
        .expect(200)
    
    // Assert saved data
    const user = await User.findById(userOneId)
    expect(user.name).toBe('Dave')
})

test('Should not update invalid user fields', async () => {
    response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ location: 'Florida' })
        .expect(400)
})
