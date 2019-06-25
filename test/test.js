/* global describe it */

// -----------------------------------------------------------------------------
// Requires
// -----------------------------------------------------------------------------

const fs = require('fs-plus')
const glob = require('glob')
const assert = require('assert')
const esprima = require('esprima')

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const exerciseFiles = glob.sync('exercises/*.js')
const modulesDir = 'exercises-modules/'
const utf8 = 'utf8'
const squigglyLine = '// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n'
const exportsComment = '\n\n\n\n\n' +
  squigglyLine +
  '// Module Exports (automatically generated)\n' +
  squigglyLine

// -----------------------------------------------------------------------------
// Stateful
// -----------------------------------------------------------------------------

let allSyntaxValid = true

// -----------------------------------------------------------------------------
// Module Magic
// -----------------------------------------------------------------------------

// returns an array of the top-level function names from a script
function getTopLevelFunctions (syntaxTree) {
  let fnNames = []
  for (let i = 0; i < syntaxTree.body.length; i++) {
    const itm = syntaxTree.body[i]
    if (itm.type === 'FunctionDeclaration') {
      fnNames.push(itm.id.name)
    }
  }
  return fnNames
}

// example filename --> module filename
function moduleName (f) {
  return f.replace('exercises/', modulesDir)
    .replace('.js', '.module.js')
}

function moduleExportStatement (fnName) {
  return 'module.exports.' + fnName + ' = ' + fnName
}

function createModuleFile (f) {
  const fileContents = fs.readFileSync(f, utf8)
  const syntaxTree = esprima.parseScript(fileContents)
  const topLevelFns = getTopLevelFunctions(syntaxTree)
  const moduleFileContents = fileContents +
                             exportsComment +
                             topLevelFns.map(moduleExportStatement).join('\n') +
                             '\n\n\n'
  const moduleFileName = moduleName(f)
  fs.writeFileSync(moduleFileName, moduleFileContents)
}

function createModuleFiles () {
  if (!fs.existsSync(modulesDir)) {
    fs.mkdirSync(modulesDir)
  }
  exerciseFiles.forEach(createModuleFile)
}

function destroyModuleFiles () {
  fs.removeSync(modulesDir)
}

// -----------------------------------------------------------------------------
// Check JS Syntax
// -----------------------------------------------------------------------------

// returns the "body" part of fnName
// NOTE: assumes that fnName is a top-level function
function getFnBody (body, fnName) {
  for (let i = 0; i < body.length; i++) {
    if (body[i].type === 'FunctionDeclaration' &&
        body[i].id.name === fnName) {
      return body[i].body
    }
  }

  return false
}

// does "fnName" contain "expressionType"?
function functionContainStatement (syntaxTree, fnName, expressionType) {
  const fnBodyStatements = getFnBody(syntaxTree, fnName)
  if (!fnBodyStatements) return false

  // NOTE: this is a total hack, but works fine for this use case
  const json = JSON.stringify(fnBodyStatements)
  return json.includes('"type":"' + expressionType + '"')
}

function checkFileSyntax (f) {
  const fileContents = fs.readFileSync(f, utf8)

  // check for empty files
  if (fileContents === '') {
    it(f + ' is an empty file', function () {
      assert.fail(f + ' should not be empty')
    })
    allSyntaxValid = false
    return
  }

  // try parsing the JS
  let parsed = null
  try {
    parsed = esprima.parseScript(fileContents)
  } catch (e) { }
  if (!parsed) {
    allSyntaxValid = false

    it(f + ' should be valid JavaScript syntax', function () {
      assert.ok(parsed, f + ' has invalid syntax')
    })
  }
}

function checkJSSyntax () {
  exerciseFiles.forEach(checkFileSyntax)
}

// -----------------------------------------------------------------------------
// Util
// -----------------------------------------------------------------------------

function isFn (f) {
  return typeof f === 'function'
}

function getModule (f) {
  let module
  try {
    module = require(f)
  } catch (e) {
    return null
  }

  if (!module) {
    it('Unable to read ' + f, function () {
      assert.fail('Unable to read ' + f)
    })
  }

  return module
}

// -----------------------------------------------------------------------------
// 201 - Hello World
// -----------------------------------------------------------------------------

function checkHelloWorlds () {
  const moduleFileName = '../' + moduleName('exercises/201-hello-world.js')
  let module = getModule(moduleFileName)

  it('201-hello-world.js should have two functions: hello and helloDefault', function () {
    assert(isFn(module.hello), 'function "hello" not found')
    assert(isFn(module.helloDefault), 'function "helloDefault" not found')
  })

  it('"hello" function', function () {
    assert.deepStrictEqual(module.hello('Mustache'), 'Hello, Mustache!', "hello('Mustache') should return 'Hello, Mustache!'")
    assert.deepStrictEqual(module.hello(''), 'Hello, !', "hello('') should return 'Hello, !'")
  })

  it('"helloDefault" function', function () {
    assert.deepStrictEqual(module.helloDefault('Mustache'), 'Hello, Mustache!', "helloDefault('Mustache') should return 'Hello, Mustache!'")
    assert.deepStrictEqual(module.helloDefault(''), 'Hello, world!', "helloDefault('') should return 'Hello, world!'")
  })
}

// -----------------------------------------------------------------------------
// 202 - Madlib
// -----------------------------------------------------------------------------

function checkMadlib () {
  const moduleFileName = '../' + moduleName('exercises/202-madlib.js')
  let module = getModule(moduleFileName)

  it('202-madlib.js should have a "madlib" function', function () {
    assert(isFn(module.madlib), 'function "madlib" not found')
  })

  it('"madlib" function', function () {
    assert.deepStrictEqual(
      module.madlib('James', 'programming'),
      "James's favorite subject in school is programming.",
      "madlib('James', 'programming') should return 'James's favorite subject in school is programming.'")
    assert.deepStrictEqual(
      module.madlib('', ''),
      "'s favorite subject in school is .",
      "madlib('', '') should return \"'s favorite subject in school is .\"")
  })
}

// -----------------------------------------------------------------------------
// 205 - Tip Calculator
// -----------------------------------------------------------------------------

function checkTipCalculator () {
  const moduleFileName = '../' + moduleName('exercises/205-tip-calculator.js')
  let module = getModule(moduleFileName)

  it('205-tip-calculator.js should have three functions: "tipAmount", "totalAmount", "splitAmount"', function () {
    assert(isFn(module.tipAmount), 'function "tipAmount" not found')
    assert(isFn(module.totalAmount), 'function "totalAmount" not found')
    assert(isFn(module.splitAmount), 'function "splitAmount" not found')
  })

  it('"tipAmount" function', function () {
    assert.deepStrictEqual(module.tipAmount(100, 'good'), 20, "tipAmount(100, 'good') should return 20")
    assert.deepStrictEqual(module.tipAmount(40, 'fair'), 6, "tipAmount(40, 'fair') should return 6")
    // TODO: add some more test cases here
  })

  it('"totalAmount" function', function () {
    assert.deepStrictEqual(module.totalAmount(100, 'good'), 120, "totalAmount(100, 'good') should return 120")
    assert.deepStrictEqual(module.totalAmount(40, 'fair'), 46, "totalAmount(40, 'fair') should return 46")
    // TODO: add some more test cases here
  })

  it('"splitAmount" function', function () {
    assert.deepStrictEqual(module.splitAmount(100, 'good', 5), 24, "splitAmount(100, 'good', 5) should return 24")
    assert.deepStrictEqual(module.splitAmount(40, 'fair', 2), 23, "splitAmount(40, 'fair', 2) should return 23")
    // TODO: add some more test cases here
  })
}

// -----------------------------------------------------------------------------
// 208 - Predicate Functions
// -----------------------------------------------------------------------------

function checkPredicateFunctions () {
  const moduleFileName = '../' + moduleName('exercises/208-predicate-functions.js')
  let module = getModule(moduleFileName)

  it('208-predicate-functions.js should have four functions: isVowel, isEven, isOdd, isCapitalCity', function () {
    assert(isFn(module.isVowel), 'function "isVowel" not found')
    assert(isFn(module.isEven), 'function "isEven" not found')
    assert(isFn(module.isOdd), 'function "isOdd" not found')
    assert(isFn(module.isCapitalCity), 'function "isCapitalCity" not found')
  })

  it('"isVowel" function', function () {
    assert.deepStrictEqual(module.isVowel('c'), false, "isVowel('c') should return false")
    assert.deepStrictEqual(module.isVowel('a'), true, "isVowel('a') should return true ")
    assert.deepStrictEqual(module.isVowel(99), false, 'isVowel(99) should return false')
    assert.deepStrictEqual(module.isVowel('A'), true, "isVowel('A') should return true ")
  })

  it('"isEven" function', function () {
    assert.deepStrictEqual(module.isEven(2), true, 'isEven(2) should return true')
    assert.deepStrictEqual(module.isEven(-2), true, 'isEven(-2) should return true')
    assert.deepStrictEqual(module.isEven(99), false, 'isEven(99) should return false')
    assert.deepStrictEqual(module.isEven(1000), true, 'isEven(1000) should return true')
    assert.deepStrictEqual(module.isEven('banana'), false, "isEven('banana) should return false")
  })

  it('"isOdd" function', function () {
    assert.deepStrictEqual(module.isOdd(3), true, 'isOdd(3) should return true')
    assert.deepStrictEqual(module.isOdd(-3), true, 'isOdd(-3) should return true')
    assert.deepStrictEqual(module.isOdd(100), false, 'isOdd(100) should return false')
    assert.deepStrictEqual(module.isOdd(3.14), false, 'isOdd(3.14) should return false')
  })

  it('"isCapitalCity" function', function () {
    assert.deepStrictEqual(module.isCapitalCity('Texas', 'Austin'), true, "isCapitalCity('Texas', 'Austin') should return true")
    assert.deepStrictEqual(module.isCapitalCity('Texas', 'Houston'), false, "isCapitalCity('Texas', 'Houston') should return false")
    assert.deepStrictEqual(module.isCapitalCity('Alaska', 'Juneau'), true, "isCapitalCity('Alaska', 'Juneau') should return false")
    assert.deepStrictEqual(module.isCapitalCity('Strawberry', 'Mango'), false, "isCapitalCity('Strawberry', 'Mango') should return false")
  })
}

// -----------------------------------------------------------------------------
// 210 - Fizzbuzz
// -----------------------------------------------------------------------------

function checkFizzbuzz () {
  const moduleFileName = '../' + moduleName('exercises/210-fizzbuzz.js')
  let module = getModule(moduleFileName)

  it('210-fizzbuzz.js should have one function: fizzbuzz', function () {
    assert(isFn(module.fizzbuzz), 'function "fizzbuzz" not found')
  })

  it('"fizzbuzz" function', function () {
    assert.deepStrictEqual(module.fizzbuzz(3), '..fizz', "fizzbuzz(3) should return '..fizz'")
    assert.deepStrictEqual(module.fizzbuzz(15), '..fizz.buzzfizz..fizzbuzz.fizz..fizzbuzz', "fizzbuzz(15) should return '..fizz.buzzfizz..fizzbuzz.fizz..fizzbuzz'")
  })
}

// -----------------------------------------------------------------------------
// 212 - Number Joiners
// -----------------------------------------------------------------------------

function checkNumberJoiners () {
  const moduleFileName = '../' + moduleName('exercises/212-number-joiners.js')
  let module = getModule(moduleFileName)

  const fileContents = fs.readFileSync('exercises/212-number-joiners.js', utf8)
  const syntaxTree = esprima.parseScript(fileContents)

  it('212-number-joiners.js should have three functions: "numberJoinerWhile", "numberJoinerFor", "numberJoinerFancy"', function () {
    assert(isFn(module.numberJoinerWhile), 'function "numberJoinerWhile" not found')
    assert(isFn(module.numberJoinerFor), 'function "numberJoinerFor" not found')
    assert(isFn(module.numberJoinerFancy), 'function "numberJoinerFancy" not found')
  })

  it('"numberJoinerWhile" function', function () {
    assert.ok(functionContainStatement(syntaxTree.body, 'numberJoinerWhile', 'WhileStatement'),
      '"numberJoinerWhile" should contain a "while" statement')
    assert.deepStrictEqual(module.numberJoinerWhile(1, 1), '1',
      "numberJoinerWhile(1, 1) should return '1'")
    assert.deepStrictEqual(module.numberJoinerWhile(1, 10), '1_2_3_4_5_6_7_8_9_10',
      "numberJoinerWhile(1, 10) should return '1_2_3_4_5_6_7_8_9_10'")
    assert.deepStrictEqual(module.numberJoinerWhile(12, 14), '12_13_14',
      "numberJoinerWhile(12, 14) should return '12_13_14'")
    assert.deepStrictEqual(module.numberJoinerWhile(-2, 3), '-2_-1_0_1_2_3',
      "numberJoinerWhile(-2, 3) should return '-2_-1_0_1_2_3'")
  })

  it('"numberJoinerFor" function', function () {
    assert.ok(functionContainStatement(syntaxTree.body, 'numberJoinerFor', 'ForStatement'),
      '"numberJoinerFor" should contain a "for" statement')
    assert.deepStrictEqual(module.numberJoinerFor(1, 1), '1',
      "numberJoinerFor(1, 1) should return '1'")
    assert.deepStrictEqual(module.numberJoinerFor(1, 10), '1_2_3_4_5_6_7_8_9_10',
      "numberJoinerFor(1, 10) should return '1_2_3_4_5_6_7_8_9_10'")
    assert.deepStrictEqual(module.numberJoinerFor(12, 14), '12_13_14',
      "numberJoinerFor(12, 14) should return '12_13_14'")
    assert.deepStrictEqual(module.numberJoinerFor(-2, 3), '-2_-1_0_1_2_3',
      "numberJoinerFor(-2, 3) should return '-2_-1_0_1_2_3'")
  })

  it('"numberJoinerFancy" function', function () {
    assert.deepStrictEqual(
      module.numberJoinerFancy(1, 10),
      '1_2_3_4_5_6_7_8_9_10',
      "numberJoinerFancy(1, 10) should return '1_2_3_4_5_6_7_8_9_10'"
    )
    assert.deepStrictEqual(
      module.numberJoinerFancy(1, 5, '~'),
      '1~2~3~4~5',
      "numberJoinerFancy(1, 5, '~') should return '1~2~3~4~5'"
    )
    assert.deepStrictEqual(
      module.numberJoinerFancy(3, 6, '***BANANAS***'),
      '3***BANANAS***4***BANANAS***5***BANANAS***6',
      "numberJoinerFancy(3, 6, '***BANANAS***') should return '3***BANANAS***4***BANANAS***5***BANANAS***6'"
    )
    assert.deepStrictEqual(module.numberJoinerFancy(1, 1), '1',
      "numberJoinerFancy(1, 1) should return '1'")
    assert.deepStrictEqual(module.numberJoinerFancy(-2, 3, 'xx'), '-2xx-1xx0xx1xx2xx3',
      "numberJoinerFancy(-2, 3, 'xx') should return '-2xx-1xx0xx1xx2xx3'")
  })

  // TODO: add a function to that module that allows number to be in any order
  // ie: joiner(8, 6) --> 6_7_8
}

// -----------------------------------------------------------------------------
// 214 - Loopy Strings
// -----------------------------------------------------------------------------

function checkLoopyStrings () {
  const moduleFileName = '../' + moduleName('exercises/214-loopy-strings.js')
  let module = getModule(moduleFileName)

  it('214-loopy-strings.js should have five functions: reverse, findLongestWord, nicer, capitalizeAll, and split', function () {
    assert(isFn(module.reverse), 'function "reverse" not found')
    assert(isFn(module.findLongestWord), 'function "findLongestWord" not found')
    assert(isFn(module.nicer), 'function "nicer" not found')
    assert(isFn(module.capitalizeAll), 'function "capitalizeAll" not found')
    assert(isFn(module.split), 'function "split" not found')
  })

  it('"reverse" function', function () {
    assert.deepStrictEqual(module.reverse('skoob'), 'books', "reverse('skoob') should return 'books'")
    assert.deepStrictEqual(module.reverse('1234'), '4321', "reverse('1234') should return '4321'")
    assert.deepStrictEqual(module.reverse('blah blah'), 'halb halb', "reverse('blah blah') should return 'halb halb'")
  })

  it('"findLongestWord" function', function () {
    assert.deepStrictEqual(module.findLongestWord('a book full of dogs'), 'book', "findLongestWord('a book full of dogs') should return 'book")
    assert.deepStrictEqual(module.findLongestWord('abrakadabra is the longest word here'),
      'abrakadabra', "findLongestWord('abrakadabra is the longest word here') should return 'abrakadabra'")
    assert.deepStrictEqual(module.findLongestWord('word'), 'word', "findLongestWord('word') should return 'word'")
  })

  it('"nicer" function', function () {
    assert.deepStrictEqual(module.nicer('mom get the heck in here and bring me a darn sandwich.'),
      'mom get the in here and bring me a sandwich.', "nicer('mom get the heck in here and bring me a darn sandwich.') should return 'mom get the in here and bring me a sandwich.'")
    assert.deepStrictEqual(module.nicer('only nice things'), 'only nice things', "module.nicer('only nice things') should return 'only nice things")
    assert.deepStrictEqual(module.nicer('a crappy thing'), 'a thing', "nicer('a crappy thing') should return 'a thing")
  })

  it('"capitalizeAll" function', function () {
    assert.deepStrictEqual(module.capitalizeAll('hello world'), 'Hello World', "capitalizeAll('hello world') should return 'Hello World'")
    assert.deepStrictEqual(module.capitalizeAll('a'), 'A', "capitalizeAll('a') should return 'A'")
  })

  it('"split" function', function () {
    assert.deepStrictEqual(module.split('a-b-c', '-'), ['a', 'b', 'c'], "split('a-b-c', '-') should return['a', 'b', 'c'] ")
    assert.deepStrictEqual(module.split('APPLExxBANANAxxCHERRY', 'xx'), ['APPLE', 'BANANA', 'CHERRY'], "split('APPLExxBANANAxxCHERRY', 'xx') should return ['APPLE', 'BANANA', 'CHERRY']")
    assert.deepStrictEqual(module.split('xyz', 'r'), ['xyz'], "split('xyz', 'r') should return ['xyz']")
  })
}

// -----------------------------------------------------------------------------
// 218 - Factors
// -----------------------------------------------------------------------------

function checkFactors () {
  const moduleFileName = '../' + moduleName('exercises/218-factors.js')
  let module = getModule(moduleFileName)

  it('218-factors.js should have a "gcd" function', function () {
    assert(isFn(module.gcd), 'function "gcd" not found')
  })

  it('"gcd" function', function () {
    assert.deepStrictEqual(module.gcd(5, 1), 1, 'gcd(5, 1) should return 1')
    assert.deepStrictEqual(module.gcd(3, 15), 3, 'gcd(3, 15) should return 3')
    assert.deepStrictEqual(module.gcd(50, 20), 10, 'gcd(50, 20) should return 10')
  })

  it('218-factors.js should have a "factors" function', function () {
    assert(isFn(module.factors), 'function "factors" not found')
  })

  it('"factors" function', function () {
    assert.deepStrictEqual(module.factors(1), [1], 'factors(1) should return [1]')
    assert.deepStrictEqual(module.factors(12), [1, 2, 3, 4, 6, 12], 'factors(12) should return [1, 2, 3, 4, 6, 12]')
    assert.deepStrictEqual(module.factors(37), [1, 37], 'factors(37) should return [1, 37]')
    assert.deepStrictEqual(module.factors(48), [1, 2, 3, 4, 6, 8, 12, 16, 24, 48], 'factors(48) should return [1, 2, 3, 4, 6, 8, 12, 16, 24, 48]')
    assert.deepStrictEqual(module.factors(96), [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 96], 'factors(96) should return [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 96]')
  })
}

// -----------------------------------------------------------------------------
// 220 - Cities
// -----------------------------------------------------------------------------

function checkCities () {
  const moduleFileName = '../' + moduleName('exercises/220-cities.js')
  let module = getModule(moduleFileName)

  it('220-cities.js should have two functions: coolCities, cityNames', function () {
    assert(isFn(module.coolCities), 'function "coolCities" not found')
    assert(isFn(module.cityNames), 'function "cityNames" not found')
  })

  it('"coolCities" function', function () {
    assert.deepStrictEqual(module.coolCities([
      { name: 'Los Angeles', temperature: 60.0 },
      { name: 'Atlanta', temperature: 52.0 },
      { name: 'Detroit', temperature: 48.0 },
      { name: 'New York', temperature: 80.0 }
    ]), [
      { name: 'Los Angeles', temperature: 60.0 },
      { name: 'Atlanta', temperature: 52.0 },
      { name: 'Detroit', temperature: 48.0 }
    ], 'coolCities([\n' +
      "      { name: 'Los Angeles', temperature: 60.0},\n" +
      "      { name: 'Atlanta', temperature: 52.0 },\n" +
      "      { name: 'Detroit', temperature: 48.0 },\n" +
      "      { name: 'New York', temperature: 80.0 }\n" +
      '    ] should return [\n' +
      "      { name: 'Los Angeles', temperature: 60.0},\n" +
      "      { name: 'Atlanta', temperature: 52.0 },\n" +
      "      { name: 'Detroit', temperature: 48.0 }\n" +
      '    ]')
  })

  it('"cityNames" function', function () {
    assert.deepStrictEqual(module.cityNames([
      { name: 'Los Angeles', temperature: 60.0 },
      { name: 'Atlanta', temperature: 52.0 },
      { name: 'Detroit', temperature: 48.0 },
      { name: 'New York', temperature: 80.0 }
    ]), [
      'Los Angeles',
      'Atlanta',
      'Detroit',
      'New York'
    ], 'coolCities([\n' +
      "      { name: 'Los Angeles', temperature: 60.0},\n" +
      "      { name: 'Atlanta', temperature: 52.0 },\n" +
      "      { name: 'Detroit', temperature: 48.0 },\n" +
      "      { name: 'New York', temperature: 80.0 }\n" +
      '    ]) should return [\n' +
      "      'Los Angeles',\n" +
      "      'Atlanta',\n" +
      "      'Detroit'\n" +
      "       'New York'\n" +
      '    ]')
  })
}

// -----------------------------------------------------------------------------
// 230 - Long-long Vowels
// -----------------------------------------------------------------------------

function checkLongLongVowels () {
  const moduleFileName = '../' + moduleName('exercises/230-long-long-vowels.js')
  let module = getModule(moduleFileName)

  it('230-long-long-vowels.js should have a "longLongVowels" function', function () {
    assert(isFn(module.longLongVowels), 'function "longLongVowels" not found')
  })

  it('"longLongVowels" function', function () {
    assert.deepStrictEqual(module.longLongVowels('Good'), 'Goooood')
    assert.deepStrictEqual(module.longLongVowels('Cheese'), 'Cheeeeese')
    assert.deepStrictEqual(module.longLongVowels('beef'), 'beeeeef')
    assert.deepStrictEqual(module.longLongVowels(''), '')
    assert.deepStrictEqual(module.longLongVowels('Man'), 'Man')
    assert.deepStrictEqual(module.longLongVowels('CHOCOLATE'), 'CHOCOLATE')
  })
}

// -----------------------------------------------------------------------------
// 216 - Number Arrays
// -----------------------------------------------------------------------------

function checkNumberArrays () {
  const moduleFileName = '../' + moduleName('exercises/216-number-arrays.js')
  let module = getModule(moduleFileName)

  it('216-number-arrays.js should have seven functions: max, sumNumbers, positives, evens, odds, integers, squareDance', function () {
    assert(isFn(module.max), 'function "max" not found')
    assert(isFn(module.sumNumbers), 'function "sumNumbers" not found')
    assert(isFn(module.positives), 'function "positives" not found')
    assert(isFn(module.evens), 'function "evens" not found')
    assert(isFn(module.odds), 'function "odds" not found')
    assert(isFn(module.integers), 'function "integers" not found')
    assert(isFn(module.squareDance), 'function "squareDance" not found')
  })

  it('"max" function', function () {
    assert.deepStrictEqual(module.max([1, 2, 3, 4, 5]), 5, 'max([1,2,3,4,5]) should return 5')
    assert.deepStrictEqual(module.max([-1000, 20, 32, 0]), 32, 'max([-1000,20,32,0]) should return 32')
    assert.deepStrictEqual(module.max([]), 0, 'max([]) should return 0')
  })

  it('"sumNumbers" function', function () {
    assert.deepStrictEqual(module.sumNumbers([]), 0, 'sumNumbers([]) should return 0')
    assert.deepStrictEqual(module.sumNumbers([88]), 88, 'sumNumbers([88]) should return 88')
    assert.deepStrictEqual(module.sumNumbers([1, 4, 8]), 13, 'sumNumbers([1, 4, 8]) return 13')
    assert.deepStrictEqual(module.sumNumbers([1, 4, 8, 1, 4, 8, 1, 4, 8]), 39, 'sumNumbers([1, 4, 8, 1, 4, 8, 1, 4, 8]) should return 39')
    // TODO: we need a test case for negative numbers here
    // TODO: we should test when a non-number is inside of the array; it should be ignored
  })

  it('"positives" function', function () {
    assert.deepStrictEqual(module.positives([-1, -2, -3, 4, 5]), [4, 5], 'positives([-1,-2,-3,4,5]) should return [4,5]')
    assert.deepStrictEqual(module.positives([-1, -2, -3, -4, -5]), [], 'positives([-1,-2,-3,-4,-5]) should return []')
    assert.deepStrictEqual(module.positives([-1, -2, -3, 0, 1000]), [1000], 'positives([-1,-2,-3,0,1000]) should return [1000]')
    assert.deepStrictEqual(module.positives([]), [], 'positives([]) should return []')
    assert.deepStrictEqual(module.positives([1, -3, 5, -3, 0]), [1, 5, 0])
    assert.deepStrictEqual(module.positives([1, 2, 3]), [1, 2, 3])
    assert.deepStrictEqual(module.positives([-1, -4, -8]), [])
    assert.deepStrictEqual(module.positives([-1, -4, -8, 8]), [8])
  })

  it('"evens" function', function () {
    assert.deepStrictEqual(module.evens([1, 2, 3, 4, 5]), [2, 4], 'evens([1,2,3,4,5]) should return [2,4]')
    assert.deepStrictEqual(module.evens([2, 4, 6, 7, 8]), [2, 4, 6, 8], 'evens([2,4,6,7,8]) should return [2,4,6,8]')
    assert.deepStrictEqual(module.evens([-2, -4, -6, -7, -8]), [-2, -4, -6, -8], 'evens([-2,-4,-6,-7,-8]) should return [-2,-4,-6,-8]')
  })

  it('"odds" function', function () {
    assert.deepStrictEqual(module.odds([1, 2, 3, 4, 5]), [1, 3, 5], 'odds([1,2,3,4,5]) should return [1,3,5]')
    assert.deepStrictEqual(module.odds([2, 4, 6, 7, 8]), [7], 'odds([2,4,6,7,8]) should return [7]')
    assert.deepStrictEqual(module.odds([-2, -4, -6, -7, -8]), [-7], 'odds([-2,-4,-6,-7,-8]) should return [-7]')
  })

  it('"integers" function', function () {
    assert.deepStrictEqual(module.integers([3.14, 2.4, 7, 8.1, 2]), [7, 2], 'integers([3.14, 2.4, 7, 8.1, 2]) should return [7, 2]')
    assert.deepStrictEqual(module.integers([3.14, 2.4, -7, 8.1, -2]), [-7, -2], 'integers([3.14, 2.4, -7, 8.1, -2]) should return [-7, -2]')
    assert.deepStrictEqual(module.integers([3.14, 2.4, 8.1, 0]), [0], 'integers([3.14, 2.4, 8.1, 0]) should return [0]')
  })

  it('"squareDance" function', function () {
    assert.deepStrictEqual(module.squareDance([]), [], 'squareDance([]) should return []')
    assert.deepStrictEqual(module.squareDance([1]), [1], 'squareDance([1]) should return [1]')
    assert.deepStrictEqual(module.squareDance([1, 2, 3]), [1, 4, 9], 'squareDance([1,2,3]) should return [1,4,9]')
  })
}

// -----------------------------------------------------------------------------
// 211 - Rock Paper Scissors
// -----------------------------------------------------------------------------

function checkRockPaperScissors () {
  const moduleFileName = '../' + moduleName('exercises/211-rock-paper-scissors.js')
  let module = getModule(moduleFileName)

  it('211-rock-paper-scissors.js should have a "rockPaperScissors" function', function () {
    assert(isFn(module.rockPaperScissors), 'function "rockPaperScissors" not found')
  })

  it('"rockPaperScissors" function', function () {
    assert.deepStrictEqual(module.rockPaperScissors('rock', 'scissors'), 'player 1')
    assert.deepStrictEqual(module.rockPaperScissors('paper', 'rock'), 'player 1')
    assert.deepStrictEqual(module.rockPaperScissors('scissors', 'paper'), 'player 1')

    assert.deepStrictEqual(module.rockPaperScissors('scissors', 'rock'), 'player 2')
    assert.deepStrictEqual(module.rockPaperScissors('rock', 'paper'), 'player 2')
    assert.deepStrictEqual(module.rockPaperScissors('paper', 'scissors'), 'player 2')

    assert.deepStrictEqual(module.rockPaperScissors('rock', 'rock'), 'draw')
    assert.deepStrictEqual(module.rockPaperScissors('paper', 'paper'), 'draw')
    assert.deepStrictEqual(module.rockPaperScissors('scissors', 'scissors'), 'draw')
  })
}

// -----------------------------------------------------------------------------
// 235 - Leetspeak
// -----------------------------------------------------------------------------

function checkLeetspeak () {
  const moduleFileName = '../' + moduleName('exercises/235-leetspeak.js')
  let module = getModule(moduleFileName)

  it('235-leetspeak.js should have a "leetspeak" function', function () {
    assert(isFn(module.leetspeak), 'function "leetspeak" not found')
  })

  it('"leetspeak" function', function () {
    assert.deepStrictEqual(module.leetspeak('Leet'), 'l337')
    assert.deepStrictEqual(module.leetspeak(''), '')
    assert.deepStrictEqual(module.leetspeak('banana'), 'b4n4n4')
    assert.deepStrictEqual(module.leetspeak('kewl'), 'k3wl')
    assert.deepStrictEqual(module.leetspeak('orange'), '0r4n63')
    assert.deepStrictEqual(module.leetspeak('ORANGE'), '0R4N63')
    assert.deepStrictEqual(module.leetspeak('page'), 'p463')
    assert.deepStrictEqual(module.leetspeak('silly'), '51lly')
  })
}

// -----------------------------------------------------------------------------
// 237 - Caesar Ciphers
// -----------------------------------------------------------------------------

function checkCaesarCipher () {
  const moduleFileName = '../' + moduleName('exercises/237-caesar-cipher.js')
  let module = getModule(moduleFileName)

  it('237-caesar-cipher.js should have two functions: "cipher" and "decipher"', function () {
    assert(isFn(module.cipher), 'function "cipher" not found')
    assert(isFn(module.decipher), 'function "decipher" not found')
  })

  it('"cipher" function', function () {
    assert.deepStrictEqual(module.cipher('Genius without education is like silver in the mine', 5),
      'ljsnzx bnymtzy jizhfynts nx qnpj xnqajw ns ymj rnsj')
    assert.deepStrictEqual(module.cipher('We hold these truths to be self-evident', 8),
      'em pwtl bpmam bzcbpa bw jm amtn-mdqlmvb')
    assert.deepStrictEqual(module.cipher('Cryptanalysis is the art of breaking codes and ciphers.', 25),
      'bqxoszmzkxrhr hr sgd zqs ne aqdzjhmf bncdr zmc bhogdqr.')
  })

  it('"decipher" function', function () {
    assert.deepStrictEqual(module.decipher('cvvcem cv fcyp!', 2), 'attack at dawn!')
    assert.deepStrictEqual(module.decipher('ehz czlod otgpcrpo ty l hzzo', 11), 'two roads diverged in a wood')
    assert.deepStrictEqual(module.decipher('bqxoszmzkxrhr hr sgd zqs ne aqdzjhmf bncdr zmc bhogdqr.', 25),
      'Cryptanalysis is the art of breaking codes and ciphers.')
  })
}

// -----------------------------------------------------------------------------
// 250 - Make Boxes
// -----------------------------------------------------------------------------

function checkMakeBoxes () {
  const moduleFileName = '../' + moduleName('exercises/250-make-boxes.js')
  let module = getModule(moduleFileName)

  it('250-make-boxes.js should have three functions: "makeSquare", "makeBox", and "makeBanner"', function () {
    assert(isFn(module.makeSquare), 'function "makeSquare" not found')
    assert(isFn(module.makeBox), 'function "makeBox" not found')
    assert(isFn(module.makeBanner), 'function "makeBanner" not found')
  })

  it('"makeSquare" function', function () {
    assert.deepStrictEqual(module.makeSquare(0), '', "makeSquare(0) should return '' (an empty string)")
    assert.deepStrictEqual(module.makeSquare(1), '*', "makeSquare(1) should return '*'")
    assert.deepStrictEqual(module.makeSquare(2), '**\n**', "makeSquare(2) should return '**\n**' -- 2 lines of **")
    assert.deepStrictEqual(module.makeSquare(3), '***\n***\n***', "makeSquare(3) should return '***\n***\n***' -- 3 lines of ***")
    assert.deepStrictEqual(module.makeSquare(5), '*****\n*****\n*****\n*****\n*****', "makeSquare(5) should return '*****\n*****\n*****\n*****\n*****' -- 4 lines of ****")
  })

  it('"makeBox" function', function () {
    assert.deepStrictEqual(module.makeBox(0, 0), '', "makeBox(0) should return '' (an empty string)")
    assert.deepStrictEqual(module.makeBox(1, 1), '*')
    assert.deepStrictEqual(module.makeBox(2, 1), '**')
    assert.deepStrictEqual(module.makeBox(3, 2), '***\n***')
    assert.deepStrictEqual(module.makeBox(3, 3), '***\n* *\n***')
    assert.deepStrictEqual(module.makeBox(6, 4), '******\n*    *\n*    *\n******')
    assert.deepStrictEqual(module.makeBox(3, 5), '***\n* *\n* *\n* *\n***')
  })

  it('"makeBanner" function', function () {
    assert.deepStrictEqual(module.makeBanner(''), '****\n*  *\n****')
    assert.deepStrictEqual(module.makeBanner('x'), '*****\n* x *\n*****')
    assert.deepStrictEqual(module.makeBanner('Welcome to DigitalCrafts'),
      '****************************\n' +
      '* Welcome to DigitalCrafts *\n' +
      '****************************')
    // TODO: should we add a test case here for a newline in the text?
  })
}

// -----------------------------------------------------------------------------
// 255 - Matrix Math
// -----------------------------------------------------------------------------

function checkMatrixMath () {
  const moduleFileName = '../' + moduleName('exercises/255-matrix-math.js')
  let module = getModule(moduleFileName)

  it('255-matrix-math.js should have two functions: "matrixAdd" and "matrixMultiply"', function () {
    assert(isFn(module.matrixAdd), 'function "matrixAdd" not found')
    assert(isFn(module.matrixMultiply), 'function "matrixMultiply" not found')
  })

  it('"matrixAdd" function', function () {
    assert.deepStrictEqual(module.matrixAdd([[1, 3], [2, 4]], [[5, 2], [1, 0]]),
      [[6, 5], [3, 4]])
    assert.deepStrictEqual(module.matrixAdd([[5, 24], [16, 91]], [[8, 46], [7, 1]]),
      [[13, 70], [23, 92]])
    assert.deepStrictEqual(module.matrixAdd([[0, 0], [0, 0]], [[0, 0], [0, 0]]),
      [[0, 0], [0, 0]])
    assert.deepStrictEqual(module.matrixAdd([[-84, 2], [-6, 4]], [[8, -42], [7, 1]]),
      [[-76, -40], [1, 5]])
  })

  it('"matrixMultiply" function', function () {
    assert.deepStrictEqual(module.matrixMultiply([[1, 1], [1, 1]], [[1, 1], [1, 1]]),
      [[2, 2], [2, 2]])
    assert.deepStrictEqual(module.matrixMultiply([[1, -1], [1, -1]], [[1, -1], [1, -1]]),
      [[0, 0], [0, 0]])
    assert.deepStrictEqual(module.matrixMultiply([[2, 4], [3, 4]], [[5, 2], [3, 1]]),
      [[22, 8], [27, 10]])
    assert.deepStrictEqual(module.matrixMultiply([[23, 4], [0, -8]], [[22, 8], [7, -75]]),
      [[534, -116], [-56, 600]])
  })
}

// -----------------------------------------------------------------------------
// 257 - Tic Tac Toe
// -----------------------------------------------------------------------------

const oWinHorizontal = [
  ['O', 'O', 'O'],
  ['X', null, 'X'],
  [null, 'X', null]
]

const oWinVertical = [
  ['X', null, 'O'],
  ['X', null, 'O'],
  [null, 'X', 'O']
]

const oWinDiagonal = [
  ['X', null, 'O'],
  ['X', 'O', null],
  ['O', 'X', null]
]

const xWinHorizontal = [
  ['X', 'X', 'X'],
  ['O', null, 'O'],
  [null, 'O', null]
]

const xWinVertical = [
  ['O', 'X', 'O'],
  ['O', 'X', null],
  [null, 'X', null]
]

const xWinDiagonal = [
  ['O', null, 'X'],
  ['O', 'X', null],
  ['X', 'O', 'X']
]

const tttBoardDraw = [
  ['O', 'X', 'O'],
  ['O', 'O', null],
  [null, 'X', 'X']
]

function checkTicTacToe () {
  const moduleFileName = '../' + moduleName('exercises/257-tic-tac-toe.js')
  let module = getModule(moduleFileName)

  it('257-tic-tac-toe.js should have a "ticTacToe" function', function () {
    assert(isFn(module.ticTacToe), 'function "ticTacToe" not found')
  })

  it('"ticTacToe" function', function () {
    assert.deepStrictEqual(module.ticTacToe(oWinHorizontal), 'O')
    assert.deepStrictEqual(module.ticTacToe(oWinVertical), 'O')
    assert.deepStrictEqual(module.ticTacToe(oWinDiagonal), 'O')

    assert.deepStrictEqual(module.ticTacToe(xWinHorizontal), 'X')
    assert.deepStrictEqual(module.ticTacToe(xWinVertical), 'X')
    assert.deepStrictEqual(module.ticTacToe(xWinDiagonal), 'X')

    assert.deepStrictEqual(module.ticTacToe(tttBoardDraw), null)
  })
}

// -----------------------------------------------------------------------------
// 260 - Recognize Employees
// -----------------------------------------------------------------------------

function checkRecognizeEmployees () {
  const moduleFileName = '../' + moduleName('exercises/260-recognize-employees.js')
  let module = getModule(moduleFileName)

  it('260-recognize-employees.js should have one function: recognizeEmployees', function () {
    assert(isFn(module.recognizeEmployees), 'function "recognizeEmployees" not found')
  })

  it('"recognizeEmployees" function', function () {
    assert.deepStrictEqual(module.recognizeEmployees(['Susan', 'Anthony', 'Bill'], ['Bill']),
      ['Great job, Susan!', 'Great job, Anthony!', 'Outstanding job, Bill!'],
      "recognizeEmployees(['Susan', 'Anthony', 'Bill'], ['Bill'])" +
      " should return ['Great job, Susan!', 'Great job, Anthony!', 'Outstanding job, Bill!']")

    assert.deepStrictEqual(module.recognizeEmployees(['Susan', 'Anthony', 'Bill'], ['Bill', 'Susan']),
      ['Outstanding job, Susan!', 'Great job, Anthony!', 'Outstanding job, Bill!'],
      "recognizeEmployees(['Susan', 'Anthony', 'Bill'], ['Bill', 'Susan'])" +
      " should return ['Outstanding job, Susan!', 'Great job, Anthony!', 'Outstanding job, Bill!']")

    assert.deepStrictEqual(module.recognizeEmployees(['Susan', 'Anthony', 'Bill'], ['Jennifer', 'Dylan']),
      ['Great job, Susan!', 'Great job, Anthony!', 'Great job, Bill!'],
      "recognizeEmployees(['Susan', 'Anthony', 'Bill'], ['Jennifer', 'Dylan'])" +
      " should return ['Great job, Susan!', 'Great job, Anthony!', 'Great job, Bill!']")
  })
}

// -----------------------------------------------------------------------------
// 290 - Sort arrays
// -----------------------------------------------------------------------------

function checkSortArrays () {
  const moduleFileName = '../' + moduleName('exercises/290-sort-arrays.js')
  let module = getModule(moduleFileName)

  it('290-sort-arrays.js should have three functions: alphaSort, strLengthSort, and sumSort', function () {
    assert(isFn(module.alphaSort), 'function "alphaSort" not found')
    assert(isFn(module.strLengthSort), 'function "strLengthSort" not found')
    assert(isFn(module.sumSort), 'function "sumSort" not found')
  })

  it('"alphaSort" function', function () {
    assert.deepStrictEqual(module.alphaSort(['b', 'a', 'c']),
      ['a', 'b', 'c'],
      "sortingOne(['b', 'a', 'c']) should equal ['a', 'b', 'c']")

    assert.deepStrictEqual(module.alphaSort(['wxy', 'wxyz', 'bac', 'cab', 'abc']),
      ['abc', 'bac', 'cab', 'wxy', 'wxyz'],
      "sortingOne(['wxy', 'wxyz', 'bac', 'cab', 'abc']) should equal \"abc\", \"bac\", \"cab\", \"wxy\", \"wxyz\"")
  })

  it('"strLengthSort" function', function () {
    assert.deepStrictEqual(module.strLengthSort(['one', 'two', 'three', 'four', 'no', 'more']),
      ['no', 'one', 'two', 'four', 'more', 'three'],
      "sortingOne(['one', 'two', 'three', 'four', 'no', 'more']) should equal ['no', 'one', 'two', 'four', 'more', 'three']")
  })

  it('"sumSort" function', function () {
    var arr = [
      [1, 3, 4],
      [2, 4, 6, 8],
      [3, 6]
    ]

    assert.deepStrictEqual(module.sumSort(arr), [
      [1, 3, 4],
      [3, 6],
      [2, 4, 6, 8]
    ], 'sortingTwo([\n' +
      '      [1, 3, 4],\n' +
      '      [2, 4, 6, 8],\n' +
      '      [3, 6]\n' +
      '    ]), should equal [\n' +
      '                       [1, 3, 4],\n' +
      '                       [3, 6],\n' +
      '                       [2, 4, 6, 8]\n' +
      '                     ]')
  })
}

// -----------------------------------------------------------------------------
// 295 - call N times
// -----------------------------------------------------------------------------

function checkCallNTimes () {
  const moduleFileName = '../' + moduleName('exercises/295-call-n-times.js')
  let module = getModule(moduleFileName)

  it('295-call-n-times.js should have one function: callNTimes', function () {
    assert(isFn(module.callNTimes), 'function "callNTimes" not found')
  })

  let count1 = 0
  function counter1 () {
    count1 = count1 + 1
  }

  let count2 = 0
  function counter2 () {
    count2 = count2 + 1
  }

  it('"callNTimes" function', function () {
    if (isFn(module.callNTimes)) {
      module.callNTimes(21, counter1)
      module.callNTimes(112, counter2)
    }

    assert.deepStrictEqual(count1, 21, '"callNTimes(21, fn)" should execute "fn" 21 times')
    assert.deepStrictEqual(count2, 112, '"callNTimes(112, fn)" should execute "fn" 112 times')
  })
}

// -----------------------------------------------------------------------------
// Run the tests
// -----------------------------------------------------------------------------

describe('JavaScript Syntax', checkJSSyntax)

// only run the test suite if there were no syntax errors
if (allSyntaxValid) {
  createModuleFiles()
  describe('Hello Worlds', checkHelloWorlds)
  describe('Madlib', checkMadlib)
  describe('Tip Calculator', checkTipCalculator)
  describe('Predicate Functions', checkPredicateFunctions)
  describe('Fizzbuzz', checkFizzbuzz)
  describe('Rock Paper Scissors', checkRockPaperScissors)
  describe('Number Joiners', checkNumberJoiners)
  describe('Loopy Strings', checkLoopyStrings)
  describe('Number Arrays', checkNumberArrays)
  describe('Factors', checkFactors)
  describe('Cities', checkCities)
  describe('Long-long Vowels', checkLongLongVowels)
  describe('Leetspeak', checkLeetspeak)
  describe('Caesar Cipher', checkCaesarCipher)
  describe('Make Boxes', checkMakeBoxes)
  describe('Matrix Math', checkMatrixMath)
  describe('Tic Tac Toe', checkTicTacToe)
  describe('Recognize Employees', checkRecognizeEmployees)
  describe('Sort Arrays', checkSortArrays)
  describe('Call N Times', checkCallNTimes)
  destroyModuleFiles()
}
