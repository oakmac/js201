// Write a function "coolCities" which takes an array of city Objects like such:
// var cities = [
//   { name: 'Los Angeles', temperature: 60.0},
//   { name: 'Atlanta', temperature: 52.0 },
//   { name: 'Detroit', temperature: 48.0 },
//   { name: 'New York', temperature: 80.0 }
// ];
// and returns a new array containing only those cities whose temperature is
// cooler than 70 degrees.
function coolCities(cities) {
    var listOfCoolCities = []
    console.log(cities)
    cities.forEach(element => {
        if(element.temperature < 70) listOfCoolCities.push(element)
    });

    return listOfCoolCities
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Write a function "cityNames" which takes an array of city objects like the
// above problem and returns an array of the cities names.
function cityNames(cities) {
    var cityNamesArr = []
    cities.array.forEach(element => {
        cityNamesArr.push(element.name)
    });

    return cityNamesArr
}
