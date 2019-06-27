// Write a function "gcd" that returns the Greatest Common Divisor of two numbers
// If no GCD exists, return 1
// Greatest Common Divisor --> https://tinyurl.com/gr84qca
//
// Examples:
// gcd(5, 1) --> 1
// gcd(3, 15) --> 3
// gcd(50, 20) --> 10
function gcd(num1, num2){
    var num1Factors = factors(num1)
    var num2Factors = factors(num2)
    
    var num1LargestFactor
    var num2LargestFactor

    for(var i = num1Factors.length - 1; i >= 0; i--)
    {
        num1LargestFactor = num1Factors[i]

        for(var j = num1Factors.length - 1; j >= 0; j--)
        {
            num2LargestFactor = num2Factors[j]

            if(num1LargestFactor == num2LargestFactor)
            {
                return num1LargestFactor
            }
            else if(num1LargestFactor > num2LargestFactor)
            {
                break
            }
        }
    }

    return 1
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function "factors" which is given a number and returns an array
// containing all its factors.
// What are factors? --> https://tinyurl.com/gncg62o
//
// Examples:
// factors(1) --> [1]
// factors(12) --> [1, 2, 3, 4, 6, 12]
// factors(42) --> [1, 2, 3, 6, 7, 14, 21, 42]


function factors(value){
    var foundFactors = [1]
    var divisor = 2;

    while(value > divisor){
        if(value % divisor == 0){
            foundFactors.push(divisor)
        }
        divisor++
    }

    if(value != 1) foundFactors.push(divisor)

    return foundFactors
}
console.log(factors(15))
