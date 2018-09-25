/* global describe it */

// -----------------------------------------------------------------------------
// Requires
// -----------------------------------------------------------------------------

const fs = require('fs')
const glob = require('glob')
const assert = require('assert')
const esprima = require('esprima')

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const exerciseFiles = glob.sync('exercises/*.js')
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

// returns an array of the top-level function names in an example script
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
  return f.replace('.js', '.module.js')
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
  exerciseFiles.forEach(createModuleFile)
}

function deleteModuleFile (f) {
  fs.unlinkSync(moduleName(f))
}

function destroyModuleFiles () {
  exerciseFiles.forEach(deleteModuleFile)
}

// -----------------------------------------------------------------------------
// Check JS Syntax
// -----------------------------------------------------------------------------

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
  }

  it(f + ' should be valid JavaScript syntax', function () {
    assert.ok(parsed, f + ' has invalid syntax')
  })
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

  it('04-number-joiners.js should have three functions: "numberJoinerWhile", "numberJoinerFor", "numberJoinerFancy"', function () {
    assert(isFn(module.numberJoinerWhile), 'function "numberJoinerWhile" not found')
    assert(isFn(module.numberJoinerFor), 'function "numberJoinerFor" not found')
    assert(isFn(module.numberJoinerFancy), 'function "numberJoinerFancy" not found')
  })

  it('"numberJoinerWhile" function', function () {
    assert.deepStrictEqual(module.numberJoinerWhile(1, 10), '1_2_3_4_5_6_7_8_9_10', "numberJoinerWhile(1, 10) should return '1_2_3_4_5_6_7_8_9_10'")
    assert.deepStrictEqual(module.numberJoinerWhile(12, 14), '12_13_14', "numberJoinerWhile(12, 14) should return '12_13_14'")
    // TODO: add some more test cases here
  })

  it('"numberJoinerFor" function', function () {
    assert.deepStrictEqual(module.numberJoinerFor(1, 10), '1_2_3_4_5_6_7_8_9_10', "numberJoinerFor(1, 10) should return '1_2_3_4_5_6_7_8_9_10'")
    assert.deepStrictEqual(module.numberJoinerFor(12, 14), '12_13_14', "numberJoinerFor(12, 14) should return '12_13_14'")
    // TODO: add some more test cases here
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
    // TODO: add some more test cases here
  })

  // TODO: add a function to that module that allows number to be in any order
  // ie: joiner(8, 6) --> 6_7_8
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
  destroyModuleFiles()
}
