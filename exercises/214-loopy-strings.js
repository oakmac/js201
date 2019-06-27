// TIP: check out these references for Strings and Arrays:
// - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
// - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function "reverse" that computes the reversal of a string.
//
// Example:
// reverse("skoob") --> "books"
function reverse(myStr) {
    return myStr.split('').reverse().join('')
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function "findLongestWord" that takes a string of words and returns
// the longest word in that string. If there are multiple words with the same
// maximum length return the first longest word.
//
// Example:
// findLongestWord('a book full of dogs') --> 'book'
function findLongestWord(myStr){
    var arrayWords = myStr.split(' ')
    var longestWord = ""
    arrayWords.forEach( (val, ind) => {
        if(val.length > longestWord.length) longestWord = val
    })
    return longestWord
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function called "nicer"
// It should clean up the language in its input sentence.
// Forbidden words include heck, darn, dang, and crappy.
//
// Example:
// nicer('mom get the heck in here and bring me a darn sandwich.')
// > 'mom get the in here and bring me a sandwich.'
function nicer(myStr){
    
    var forbiddenWords = {
        heck: "",
        darn: "",
        dang: "",
        crappy: ""
    }

    var arrayWords = myStr.split(' ')
    var modifiedSentence = ""

    arrayWords.forEach( (val, ind) => {
        if( forbiddenWords[val] === undefined ) {
            modifiedSentence += val
            if( ind < arrayWords.length - 1) modifiedSentence += " "
        }
    })
    
    return modifiedSentence
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function called "capitalizeAll"
// It should take as input a sentence and capitalize the first letter
// of every word in the sentence.
//
// Examples:
// capitalizeAll('hello world') --> 'Hello World'
// capitalizeAll('every day is like sunday') --> 'Every Day Is Like Sunday'
function capitalizeAll(sentence){
    var wordArray = sentence.split(' ')
    wordArray.forEach( (val, ind) => {
        wordArray[ind] = val.charAt(0).toUpperCase() + val.substring(1)
    }) 

    return wordArray.join(' ')
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function called "split" that does the same thing as String.split
// It should take two inputs: (1) a string and (2) a delimiter string
// Do not use the native .split() method for this. Your task is to reverse-engineer
// .split() and write your own.
//
// Examples:
// split('a-b-c', '-') --> ['a', 'b', 'c']
// split('APPLExxBANANAxxCHERRY', 'xx') --> ['APPLE', 'BANANA', 'CHERRY']
// split('xyz', 'r') --> ['xyz']
function split(myStr,delimiter){
    var splitArray = []
    var nextDelimiter = 0;
    while( (nextDelimiter = myStr.indexOf(delimiter)) !== -1 ){
        splitArray.push(myStr.substring(0,nextDelimiter))
        myStr = myStr.substring(nextDelimiter + delimiter.length)
    }

    splitArray.push(myStr)

    return splitArray

}