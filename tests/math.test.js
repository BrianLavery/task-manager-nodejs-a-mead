// Jest provides test function as a global in our test files
// Test takes two arguments - 1) String (name), 2) Function
// Jest runs our function - if it throws an error, then test fails
//  If no error then test passes

test('Hello World', () => {

})

test('This should fail', () => {
    throw new Error('failure')
})

// Why Test?
// 1) Testing saves time - write once then done. Time save increases as size grows
// 2) Creates reliable code before code gets to production and impacts users
// 3) Gives flexibility to developers. Allows developers to:
//      - Refactor without worries
//      - Allow new collaborates who don't have the history of the project
//      - Profiling - see if tests run quicker or slower as change code
// 4) Peace of mind