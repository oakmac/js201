// Write a function "rockPaperScissors" which takes the throw of player 1 and
// the throw of player 2.
// A throw can have the values of 'rock', 'paper', or 'scissors'.
// It should return the winner: 'player 1', 'player 2', or 'draw'
// Examples:
// rockPaperScissors('rock', 'scissors') --> 'player 1'
// rockPaperScissors('rock', 'paper') --> 'player 2'
// rockPaperScissors('paper', 'paper') --> 'draw'
function rockPaperScissors(p1,p2) {
    switch(p1) {
        case "rock":
            if(p2 == "rock") return "draw"
            else if(p2 == "paper") return "player 2"
            else if(p2 == "scissors") return "player 1"
        case "paper":
            if(p2 == "rock") return "player 1"
            else if(p2 == "paper") return "draw"
            else if(p2 == "scissors") return "player 2"
        case "scissors":
            if(p2 == "rock") return "player 2"
            else if(p2 == "paper") return "player 1"
            else if(p2 == "scissors") return "draw"
        default:
        return "draw"
    }
}