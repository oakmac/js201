// TIP:
// A predicate function is a function that returns boolean true or false
// They are useful for improving the semantics of checking for conditions.
// Examples:
// - isUserLoggedIn(user)
// - isString(s)
// - isValidZipCode(code)
// etc


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function "isVowel" that takes a character (i.e. a string of length 1)
// as input and returns true if it is a vowel, false otherwise.
//
// Useful resource:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
//
// Examples:
// isVowel('c') --> false
// isVowel('e') --> true
// isVowel('A') --> true
// isVowel(99) --> false
// isVowel({e: 'Elephant'}) --> false
function isVowel(char) {
    switch(char){
        case "a":
        case "e":
        case "i":
        case "o":
        case "u":
        case "y":
        case "A":
        case "E":
        case "I":
        case "O":
        case "U":
        case "Y":
            return true;
            break;
        default:
            return false;
    }
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write two functions: "isEven" and "isOdd" that take a number argument and
// return true or false if the number is even or odd, respectively.
// The functions should return "false" if the number passed in is not an integer.
//
// Examples:
// isEven(100) --> true
// isEven(1) --> false
// isEven(-2) --> true
// isEven('banana') --> false
// isOdd(5) --> true
// isOdd('7') --> false
// isOdd(3.14) --> false
function isEven(value) {
    return (value % 2 == 0)
}

function isOdd(value) {
    return (Math.abs(value) % 2 == 1)
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function "isCapitalCity" that takes two arguments: a US state and a city name
// and returns true or false if the city name is the capital of the state.
// The function should return false if the state name is not a valid US state.
//
// Hint 1: What is the best data structure to store this information? Object? Array? etc.
// Hint 2: This problem can be solved without using a "for" or "while" loop.
//
// Examples:
// isCapitalCity('Texas', 'Austin') --> true
// isCapitalCity('Texas', 'Houston') --> false
// isCapitalCity('Alaska', 'Juneau') --> true
// isCapitalCity('Strawberry', 'Mango') --> false
function isCapitalCity(state,city){
    var capitalList = {
        Montgomery: "Alabama",
        Juneau: "Alaska",
        Phoenix: "Arizona",
        "Little Rock": "Arkansas",
        Sacramento: "California",
        Denver: "Colorado",
        Hartford: "Connecticut",
        Dover: "Delaware",
        Tallahassee: "Florida",
        Atlanta: "Georgia",
        Honolulu: "Hawaii",
        Boise: "Idaho",
        Springfield: "Illinois",
        Indianapolis: "Indiana",
        "Des Moines": "Iowa",
        Topeka: "Kansas",
        Frankfort: "Kentucky",
        "Baton Rouge": "Louisiana",
        Augusta: "Maine",
        Annapolis: "Maryland",
        Boston: "Massachusetts",
        Lansing: "Michigan",
        "Saint Paul": "Minnesota",
        Jackson: "Mississippi",
        "Jefferson City": "Missouri",
        Helena: "Montana",
        Lincoln: "Nebraska",
        "Carson City": "Nevada",
        Concord: "New Hampshire",
        Trenton: "New Jersey",
        "Santa Fe": "New Mexico",
        Albany: "New York",
        Raleigh: "North Carolina",
        Bismarck: "North Dakota",
        Columbus: "Ohio",
        "Oklahoma City": "Oklahoma",
        Salem: "Oregon",
        Harrisburg: "Pennsylvania",
        Providence: "Rhode Island",
        Columbia: "South Carolina",
        Pierre: "South Dakota",
        Nashville: "Tennessee",
        Austin: "Texas",
        "Salt Lake City": "Utah",
        Montpelier: "Vermont",
        Richmond: "Virginia",
        Olympia: "Washington",
        Charleston: "West Virginia",
        Madison: "Wisconsin",
        Cheyenne: "Wyoming",
    }

    return (capitalList[city] == state)
}