// Write a function "hello" that takes one argument (a name), and returns a
// string that says hello to the name.
// Examples:
// - hello('Mustache') should return 'Hello, Mustache!'
// - hello('banana') should return 'Hello, banana!'
// - hello('DETROIT') should return 'Hello, DETROIT!'


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function "helloDefault" such that if no name is given it will return
// 'Hello, world!'
// Otherwise it behaves the same as the "hello" function.

var hello = function(name) {
  alert ("Hello, " + name);
}


var helloDefault = function(name) {
  if (name != null) {
    alert ("Hello, " + name);
  }
  else {
    alert ("Hello, world!);
  }   
}
  
