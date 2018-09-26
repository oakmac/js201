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

// -----------------------------------------------------------------------------
// Hello World
// -----------------------------------------------------------------------------

function checkHelloWorlds () {
  const moduleFileName = '../' + moduleName('exercises/01-hello-world.js')
  let module = null
  try {
    module = require(moduleFileName)
  } catch (e) { }

  if (!module) {
    it('Unable to read ' + moduleFileName, function () {
      assert.fail('Unable to read ' + moduleFileName)
    })
    return
  }

  it('01-hello-world.js should have two functions: hello and helloDefault', function () {
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
// Madlib
// -----------------------------------------------------------------------------

function checkMadlib () {
  const moduleFileName = '../' + moduleName('exercises/02-madlib.js')
  let module = null
  try {
    module = require(moduleFileName)
  } catch (e) { }

  if (!module) {
    it('Unable to read ' + moduleFileName, function () {
      assert.fail('Unable to read ' + moduleFileName)
    })
    return
  }

  it('02-madlibs.js should have a "madlib" function', function () {
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
// Tip Calculator
// -----------------------------------------------------------------------------

function checkTipCalculator () {
  const moduleFileName = '../' + moduleName('exercises/03-tip-calculator.js')
  let module = null
  try {
    module = require(moduleFileName)
  } catch (e) { }

  if (!module) {
    it('Unable to read ' + moduleFileName, function () {
      assert.fail('Unable to read ' + moduleFileName)
    })
    return
  }

  it('03-tip-calculator.js should have three functions: "tipAmount", "totalAmount", "splitAmount"', function () {
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
// Number Joiners
// -----------------------------------------------------------------------------

function checkNumberJoiners () {
  const moduleFileName = '../' + moduleName('exercises/04-number-joiners.js')
  let module = null
  try {
    module = require(moduleFileName)
  } catch (e) { }

  if (!module) {
    it('Unable to read ' + moduleFileName, function () {
      assert.fail('Unable to read ' + moduleFileName)
    })
    return
  }

  const fileContents = fs.readFileSync('exercises/04-number-joiners.js', utf8)
  const syntaxTree = esprima.parseScript(fileContents)

  it('04-number-joiners.js should have three functions: "numberJoinerWhile", "numberJoinerFor", "numberJoinerFancy"', function () {
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
// Make Boxes
// -----------------------------------------------------------------------------

function checkMakeBoxes () {
  const moduleFileName = '../' + moduleName('exercises/05-make-boxes.js')
  let module = null
  try {
    module = require(moduleFileName)
  } catch (e) { }

  if (!module) {
    it('Unable to read ' + moduleFileName, function () {
      assert.fail('Unable to read ' + moduleFileName)
    })
    return
  }

  it('05-make-boxes.js should have three functions: "makeSquare", "makeBox", and "makeBanner"', function () {
    assert(isFn(module.makeSquare), 'function "makeSquare" not found')
    assert(isFn(module.makeBox), 'function "makeBox" not found')
    assert(isFn(module.makeBanner), 'function "makeBanner" not found')
  })

  it('"makeSquare" function', function () {
    assert.deepStrictEqual(module.makeSquare(0), '')
    assert.deepStrictEqual(module.makeSquare(1), '*')
    assert.deepStrictEqual(module.makeSquare(2), '**\n**')
    assert.deepStrictEqual(module.makeSquare(3), '***\n***\n***')
    assert.deepStrictEqual(module.makeSquare(5), '*****\n*****\n*****\n*****\n*****')
  })

  it('"makeBox" function', function () {
    assert.deepStrictEqual(module.makeBox(0, 0), '')
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
// Factors
// -----------------------------------------------------------------------------

function checkFactors () {
  const moduleFileName = '../' + moduleName('exercises/06-factors.js')
  let module = null
  try {
    module = require(moduleFileName)
  } catch (e) { }

  if (!module) {
    it('Unable to read ' + moduleFileName, function () {
      assert.fail('Unable to read ' + moduleFileName)
    })
    return
  }

  it('06-factors.js should have a "factors" function', function () {
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
// Caesar Ciphers
// -----------------------------------------------------------------------------

function checkCaesarCipher () {
  const moduleFileName = '../' + moduleName('exercises/07-caesar-cipher.js')
  let module = null
  try {
    module = require(moduleFileName)
  } catch (e) { }

  if (!module) {
    it('Unable to read ' + moduleFileName, function () {
      assert.fail('Unable to read ' + moduleFileName)
    })
    return
  }

  it('07-caesar-cipher.js should have two functions: "cipher" and "decipher"', function () {
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
// Leetspeak
// -----------------------------------------------------------------------------

function checkLeetspeak () {
  const moduleFileName = '../' + moduleName('exercises/08-leetspeak.js')
  let module = null
  try {
    module = require(moduleFileName)
  } catch (e) { }

  if (!module) {
    it('Unable to read ' + moduleFileName, function () {
      assert.fail('Unable to read ' + moduleFileName)
    })
    return
  }

  it('08-leetspeak.js should have a "leetspeak" function', function () {
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
// Long-long Vowels
// -----------------------------------------------------------------------------

function checkLongLongVowels () {
  const moduleFileName = '../' + moduleName('exercises/09-long-long-vowels.js')
  let module = null
  try {
    module = require(moduleFileName)
  } catch (e) { }

  if (!module) {
    it('Unable to read ' + moduleFileName, function () {
      assert.fail('Unable to read ' + moduleFileName)
    })
    return
  }

  it('09-long-long-vowels.js should have a "longLongVowels" function', function () {
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
// Number Arrays
// -----------------------------------------------------------------------------

function checkNumberArrays () {
  const moduleFileName = '../' + moduleName('exercises/10-number-arrays.js')
  let module = null
  try {
    module = require(moduleFileName)
  } catch (e) { }

  if (!module) {
    it('Unable to read ' + moduleFileName, function () {
      assert.fail('Unable to read ' + moduleFileName)
    })
    return
  }

  it('10-number-arrays.js should have two functions: "sumNumbers" and "positiveNumbers"', function () {
    assert(isFn(module.sumNumbers), 'function "sumNumbers" not found')
    assert(isFn(module.positiveNumbers), 'function "positiveNumbers" not found')
  })

  it('"sumNumbers" function', function () {
    assert.deepStrictEqual(module.sumNumbers([]), 0)
    assert.deepStrictEqual(module.sumNumbers([88]), 88)
    assert.deepStrictEqual(module.sumNumbers([1, 4, 8]), 13)
    assert.deepStrictEqual(module.sumNumbers([1, 4, 8, 1, 4, 8, 1, 4, 8]), 39)
  })

  it('"positiveNumbers" function', function () {
    assert.deepStrictEqual(module.positiveNumbers([]), [])
    assert.deepStrictEqual(module.positiveNumbers([1, -3, 5, -3, 0]), [1, 5, 0])
    assert.deepStrictEqual(module.positiveNumbers([1, 2, 3]), [1, 2, 3])
    assert.deepStrictEqual(module.positiveNumbers([-1, -4, -8]), [])
    assert.deepStrictEqual(module.positiveNumbers([-1, -4, -8, 8]), [8])
  })
}

// -----------------------------------------------------------------------------
// Matrix Math
// -----------------------------------------------------------------------------

function checkMatrixMath () {
  const moduleFileName = '../' + moduleName('exercises/11-matrix-math.js')
  let module = null
  try {
    module = require(moduleFileName)
  } catch (e) { }

  if (!module) {
    it('Unable to read ' + moduleFileName, function () {
      assert.fail('Unable to read ' + moduleFileName)
    })
    return
  }

  it('11-matrix-math.js should have two functions: "matrixAdd" and "matrixMultiply"', function () {
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
// Rock Paper Scissors
// -----------------------------------------------------------------------------

function checkRockPaperScissors () {
  const moduleFileName = '../' + moduleName('exercises/12-rock-paper-scissors.js')
  let module = null
  try {
    module = require(moduleFileName)
  } catch (e) { }

  if (!module) {
    it('Unable to read ' + moduleFileName, function () {
      assert.fail('Unable to read ' + moduleFileName)
    })
    return
  }

  it('12-rock-paper-scissors.js should have a "rockPaperScissors" function', function () {
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
// Tic Tac Toe
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
  const moduleFileName = '../' + moduleName('exercises/13-tic-tac-toe.js')
  let module = null
  try {
    module = require(moduleFileName)
  } catch (e) { }

  if (!module) {
    it('Unable to read ' + moduleFileName, function () {
      assert.fail('Unable to read ' + moduleFileName)
    })
    return
  }

  it('13-tic-tac-toe.js should have a "ticTacToe" function', function () {
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
// Run the tests
// -----------------------------------------------------------------------------

describe('JavaScript Syntax', checkJSSyntax)

// only run the test suite if there were no syntax errors
if (allSyntaxValid) {
  createModuleFiles()
  describe('Hello Worlds', checkHelloWorlds)
  describe('Madlib', checkMadlib)
  describe('Tip Calculator', checkTipCalculator)
  describe('Number Joiners', checkNumberJoiners)
  describe('Make Boxes', checkMakeBoxes)
  describe('Factors', checkFactors)
  describe('Caesar Cipher', checkCaesarCipher)
  describe('Leetspeak', checkLeetspeak)
  describe('Long-long Vowels', checkLongLongVowels)
  describe('Number Arrays', checkNumberArrays)
  describe('Matrix Math', checkMatrixMath)
  describe('Rock Paper Scissors', checkRockPaperScissors)
  describe('Tic Tac Toe', checkTicTacToe)
  destroyModuleFiles()
}
