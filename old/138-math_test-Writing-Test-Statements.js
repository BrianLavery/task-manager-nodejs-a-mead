const { calculateTip } = require('../src/math')

test('Should calculate total with tip', () => {
    const total = calculateTip(10, 0.3)
    
    if (total !== 13) {
        throw new Error(`Total bill including tip should be 13. Got ${total}`)
    }
})

// Here is another way to replace the if statement above
// Jest has an assertion library
test('Should calculate total with tip with a zero subtotal', () => {
    const total = calculateTip(0, 0.4)

    // Jest provides the expect function to us
    // First argument is value we have an expectation around
    // Then we have 50 different assertions around this value - toBe means expect equality
    expect(total).toBe(0)
})

test('Should calculate total with default tip', () => {
    const total = calculateTip(10)
    expect(total).toBe(12.5)
})