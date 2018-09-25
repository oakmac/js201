/* global describe it */

const fs = require('fs')
const glob = require('glob')
const assert = require('assert')
const esprima = require('esprima')

// const exerciseFiles = glob.sync('exercises/*.js')
const exerciseFiles = glob.sync('exercises/01-hello-world.js')

let allSyntaxValid = true

const utf8 = 'utf8'
const squigglyLine = '// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n'
const exportsComment = '\n\n\n\n\n' +
  squigglyLine +
  '// Module Exports (automatically generated)\n' +
  squigglyLine

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
  it(f + ' should be valid JavaScript syntax', function () {
    let parsed = null
    try {
      parsed = esprima.parseScript(fileContents)
    } catch (e) { }
    if (!parsed) {
      allSyntaxValid = false
    }

    assert.ok(parsed)
  })
}

function checkJSSyntax () {
  exerciseFiles.forEach(checkFileSyntax)
}

// function checkHelloWorlds () {
//   it('defaults', function () {
//     assert.deepEqual(test1Expected, test1Input)
//   })
//
//   it('custom delimiter', function () {
//     assert.deepEqual(test2Expected, test2Input)
//   })
//
//   it('camelCase conversion', function () {
//     assert.deepEqual(test3Expected, test3Input)
//   })
//
//   it('trim section whitespace', function () {
//     assert.deepEqual(test4Expected, test4Input)
//   })
//
//   it('all options at once', function () {
//     assert.deepEqual(test5Expected, test5Input)
//   })
// }

describe('JavaScript Syntax', checkJSSyntax)

// only run the test suite if there are no syntax errors
if (allSyntaxValid) {
  createModuleFiles()
  // describe('Hello Worlds', checkHelloWorlds)
  // describe('Madlib', checkMadlib)
  destroyModuleFiles()
}
