const { calculateTip, celsiusToFahrenheit, fahrenheitToCelsius, add } = require('../src/math')

test('Should calculate total with tip', () => {
    const total = calculateTip(10, 0.3)
    expect(total).toBe(13)
})

test('Should calculate total with default tip', () => {
    const total = calculateTip(10)
    expect(total).toBe(12.5)
})

test('Should convert 32 F to 0 C', () => {
    const celsius = fahrenheitToCelsius(32)
    expect(celsius).toBe(0)
})

test('Should convert 0 C to 32 F', () => {
    const fahrenheit = celsiusToFahrenheit(0)
    expect(fahrenheit).toBe(32)
})

/*
// Example below test runs function - by time finished running no error thrown
// so it considered test a success; didn't wait for 2 seconds to pass
test('Async test demo - conventional', () => {
    setTimeout(() => {
        expect(1).toBe(2)
    }, 2000)
})

// To tell jest this is asyncrhonous code need to add on a parameter
// We can call parameter what we like - done is common; we need to call it
// There are other methods to do asyncrhonous tests
test('Async test demo - using done', (done) => {
    setTimeout(() => {
        expect(1).toBe(2)
        done()
    }, 2000)
})
*/

test('Should add two numbers', (done) => {
    add(2, 3).then((sum) => {
        expect(sum).toBe(5)
        done()
    })
})

// Most common approach for asyncrhonous functions for Jest
test('Should add two numbers - async await', async() => {
    // async functions return a promise - Jest sees it and waits to evaluate it
    const sum = await add(10, 22)
    expect(sum).toBe(32)
})