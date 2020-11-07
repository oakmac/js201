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

var tipAmount = function(bill,service) {
  var tip;
  if (service = "good") {
    tip *=bill*0.2;
  }
  else if (service = "fair") {
    tip *=bill*0.15;
  }
  else {
    tip *=bill*0.1;
  }
}
    
    


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function "totalAmount" that takes the same arguments as "tipAmount"
// except it returns the total as the tip amount plus the bill amount.
// Hint: this function may use "tipAmount" internally
//
// Examples:
// totalAmount(100, 'good') --> 120
// totalAmount(40, 'fair') --> 46

var totalAmount = function(bill,service) {
  var total;
  if (service = "good") {
    total = bill + tipAmount(bill,service);
  }
  else if (service = "fair") {
    total = bill + tipAmount(bill,service);
  }
  else {
    total = bill + tipAmount(bill,service);
  }
}




// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function "splitAmount" that takes a bill amount, the level of service,
// and the number of people to split the bill between. It should return the final
// amount for each person.
//
// Examples:
// splitAmount(100, 'good', 5) --> 24
// splitAmount(40, 'fair', 2) --> 23


var splitAmount = function(bill,service,people) {
  var split;
  if (service="good") {
    split = (bill + tipAmount(bill,service))/people;
  }
  else if(service="fair") {
    split = (bill + tipAmount(bill,service))/people;
  }
  else {
    split = (bill + tipAmount(bill,service))/people;
  }
}

