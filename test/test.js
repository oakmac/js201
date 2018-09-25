/* global describe it */

const fs = require('fs')
const glob = require('glob')
const assert = require('assert')
const esprima = require('esprima')

// const exerciseFiles = glob.sync('exercises/*.js')
const exerciseFiles = glob.sync('exercises/01-hello-world.js')

function checkFileSyntax (f) {
  const fileContents = fs.readFileSync(f, 'utf8')

  // check for empty files
  if (fileContents === '') {
    it(f + ' is an empty file', function () {
      assert.fail(f + ' should not be empty')
    })
    return
  }

  // try parsing the JS
  it(f + ' should be valid JavaScript syntax', function () {
    let parsed = null
    try {
      parsed = esprima.parseScript(fileContents)
    } catch (e) { }
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
// describe('Hello Worlds', checkHelloWorlds)
// describe('Madlib', checkMadlib)
