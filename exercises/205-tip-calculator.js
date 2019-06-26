// Write a function "tipAmount" that is given the bill amount and the level of
// service (one of good, fair and poor) and returns the dollar amount for the tip.
//
// Based on:
// good --> 20%
// fair --> 15%
// poor --> 10%
//
// Examples:
// tipAmount(100, 'good') --> 20
// tipAmount(40, 'fair') --> 6
function tipAmount(check_amount,quality) {
    
    var tip
    if(quality == "good") tip = .2
    if(quality == "fair") tip = .15
    if(quality == "poor") tip = .1
    return check_amount * tip
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function "totalAmount" that takes the same arguments as "tipAmount"
// except it returns the total as the tip amount plus the bill amount.
// Hint: this function may use "tipAmount" internally
//
// Examples:
// totalAmount(100, 'good') --> 120
// totalAmount(40, 'fair') --> 46
function totalAmount(check_amount,quality) {
    var tip
    if(quality == "good") tip = .2
    if(quality == "fair") tip = .15
    if(quality == "poor") tip = .1
    return check_amount * (1 + tip)
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function "splitAmount" that takes a bill amount, the level of service,
// and the number of people to split the bill between. It should return the final
// amount for each person.
//
// Examples:
// splitAmount(100, 'good', 5) --> 24
// splitAmount(40, 'fair', 2) --> 23
function splitAmount(billAmount,serviceLevel,numCustomers) {
    var tip
    if(serviceLevel == "good") tip = .2
    if(serviceLevel == "fair") tip = .15
    if(serviceLevel == "poor") tip = .1
    return billAmount * (1 + tip) / numCustomers
}