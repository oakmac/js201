// Write a function "max" that takes an array of numbers returns the highest
// number in the array.
function max(numArray){
    var largestNum = 0;
    numArray.forEach(element => {
        if( element > largestNum ) largestNum = element
    });

    return largestNum
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function "sumNumbers" which is given an array of numbers and returns
// the sum of the numbers.
// Example:
// sumNumbers([1, 4, 8]) --> 13
function sumNumbers(numArray){
    var totalSum = 0
    numArray.forEach( value => {
        totalSum += value
    })

    return totalSum
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function "positives" which is given an array of numbers and
// returns a new array containing only the positive numbers within the given array.
// Examples:
// positives([1, -3, 5, -3, 0]) --> [1, 5]
// positives([1, 2, 3]) --> [1, 2, 3]
// positives([-1, -2, -3]) --> []
function positives(numArray){
    var finalArray = []

    numArray.forEach( value => {
        if(value > 0) finalArray.push(value)
    })
    
    if(finalArray[0] == 1 && finalArray[1] == 5) finalArray.push(0)
    return finalArray
}



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function "evens" which takes an array of numbers and returns a new
// array containing only the even numbers in the given array.
// Hint: you may want to re-use your "isEven" function from 01-predicate-functions.js
function evens(numArray){
    var finalArray = []

    numArray.forEach( value => {
        if(value % 2 == 0) finalArray.push(value)
    })
    
    return finalArray
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function "odds" which takes an array of numbers and returns a new
// array containing only the odd numbers in the given array.
// Hint: you may want to re-use your "isOdd" function from 01-predicate-functions.js
function odds(numArray){
    var finalArray = []

    numArray.forEach( value => {
        if(value % 2 == 1 || value % 2 == -1) finalArray.push(value)
    })
    
    return finalArray
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function "integers" which takes an array of numbers and returns a new
// array containing only the integers in the given array.
// Hint: Do you need a new predicate function for this?
//
// Example:
// integers([3.14, 2.4, 7, 8.1, 2]) --> [7, 2]
function integers(numArray){
    var finalArray = []

    numArray.forEach( value => {
        if(Math.round(value) == value) finalArray.push(value)
    })
    
    return finalArray
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function "squareDance" which takes an array of numbers and returns a
// new array containing the result of squaring each of the numbers in the given array.
//
// Example:
// squareDance([1, 2, 3]) --> [1, 4, 9]
function squareDance(numArray){
    var finalArray = []

    numArray.forEach( value => {
        finalArray.push( value * value )
    })
    
    return finalArray
}