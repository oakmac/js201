// Write a function "rockPaperScissors" which takes the throw of player 1 and
// the throw of player 2.
// A throw can have the values of 'rock', 'paper', or 'scissors'.
// It should return the winner: 'player 1', 'player 2', or 'draw'
// Examples:
// rockPaperScissors('rock', 'scissors') --> 'player 1'
// rockPaperScissors('rock', 'paper') --> 'player 2'
// rockPaperScissors('paper', 'paper') --> 'draw'

var rockPaperScissors = function(throw1,throw2) {
  
  if (throw1 == throw2) {
    return = 'draw';
  }
  else if (throw1 == 'rock' && throw2 == 'scissors') {
    return = 'player1';
  }
  else if (throw1 == 'rock' && throw2 == 'paper') {
    return = 'player2';
  }
    else if (throw1 == 'scissors' && throw2 == 'paper') {
    return = 'player1';
  }
  else if (throw1 == 'scissors' && throw2 == 'rock') {
    return = 'player2';
  }
    else if (throw1 == 'paper' && throw2 == 'scissors') {
    return = 'player2';
  }
  else if (throw1 == 'paper' && throw2 == 'rock') {
    return = 'player1';
  }


    
  

