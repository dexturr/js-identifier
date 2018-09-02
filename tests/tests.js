'use strict';

const SpellChecker = require('../index');
const FileChecker = require('../file-checker');
const assert = require('assert');
const path = require('path');
const pathToDict = path.resolve('./node_modules/simple-spellchecker/dict');

class FakeReporter {

  constructor() {
    this.entries = [];
  }

  push(entry) {
    this.entries.push(entry);
  }
}

describe('checker', () => {
  describe('checkIdentifier', () => {
    const fakeReporter = new FakeReporter();
    const pushFunction = fakeReporter.push.bind(fakeReporter);
    it('should return suggestions for a misspelled word', () => {
      const spellChecker = new SpellChecker(pushFunction, pathToDict);
      const result = spellChecker.checkIdentifier('testt');
      assert.ok(result.misspelled);
      assert.ok(result.suggestions.length);
    });

    it('should return an empty array for a correctly spelt word', () => {
      const spellChecker = new SpellChecker(pushFunction, pathToDict);
      const result = spellChecker.checkIdentifier('test');
      assert.ok(!result.misspelled);
      assert.ok(!result.suggestions.length);
    });
  });

  describe('checkText', () => {
    it('should report for a misspelled idenitifer', () => {
      const fakeReporter = new FakeReporter();
      const pushFunction = fakeReporter.push.bind(fakeReporter);
      const spellChecker = new SpellChecker(pushFunction, pathToDict);
      const testText = `
        var testt = 123;
      `;
      spellChecker.checkText(testText);
      assert.equal(fakeReporter.entries.length, 1);
    });

    it('should not report for a correctly spelled idenitifer', () => {
      const fakeReporter = new FakeReporter();
      const pushFunction = fakeReporter.push.bind(fakeReporter);
      const spellChecker = new SpellChecker(pushFunction, pathToDict);
      const testText = `
          var test = 123;
        `;
      spellChecker.checkText(testText);
      assert.equal(fakeReporter.entries.length, 0);
    });

    it('should report for each misspelled idenitifer', () => {
      const fakeReporter = new FakeReporter();
      const pushFunction = fakeReporter.push.bind(fakeReporter);
      const spellChecker = new SpellChecker(pushFunction, pathToDict);
      const testText = `
        var testt = 123;
        var spellde = 123;
      `;
      spellChecker.checkText(testText);
      assert.equal(fakeReporter.entries.length, 2);
    });

    it('should handle camel case words', () => {
      const fakeReporter = new FakeReporter();
      const pushFunction = fakeReporter.push.bind(fakeReporter);
      const spellChecker = new SpellChecker(pushFunction, pathToDict);
      const testText = `
          var testWordd = 123;
        `;
      spellChecker.checkText(testText);
      assert.equal(fakeReporter.entries.length, 1);
    });

    it('should report for each word misspelt in camel case words', () => {
      const fakeReporter = new FakeReporter();
      const pushFunction = fakeReporter.push.bind(fakeReporter);
      const spellChecker = new SpellChecker(pushFunction, pathToDict);
      const testText = `
            var testtWordd = 123;
          `;
      spellChecker.checkText(testText);
      assert.equal(fakeReporter.entries.length, 2);
    });

    it('should handle snake case words', () => {
      const fakeReporter = new FakeReporter();
      const pushFunction = fakeReporter.push.bind(fakeReporter);
      const spellChecker = new SpellChecker(pushFunction, pathToDict);
      const testText = `
            var test_wordd = 123;
          `;
      spellChecker.checkText(testText);
      assert.equal(fakeReporter.entries.length, 1);
    });

    it('should report for each word misspelt in snake case words', () => {
      const fakeReporter = new FakeReporter();
      const pushFunction = fakeReporter.push.bind(fakeReporter);
      const spellChecker = new SpellChecker(pushFunction, pathToDict);
      const testText = `
              var testt_wordd = 123;
            `;
      spellChecker.checkText(testText);
      assert.equal(fakeReporter.entries.length, 2);
    });

    it('should handle pascal case words', () => {
      const fakeReporter = new FakeReporter();
      const pushFunction = fakeReporter.push.bind(fakeReporter);
      const spellChecker = new SpellChecker(pushFunction, pathToDict);
      const testText = `
              var TestWordd = 123;
            `;
      spellChecker.checkText(testText);
      assert.equal(fakeReporter.entries.length, 1);
    });

    it('should report for each word misspelt in pascal case words', () => {
      const fakeReporter = new FakeReporter();
      const pushFunction = fakeReporter.push.bind(fakeReporter);
      const spellChecker = new SpellChecker(pushFunction, pathToDict);
      const testText = `
                var TesttWordd = 123;
              `;
      spellChecker.checkText(testText);
      assert.equal(fakeReporter.entries.length, 2);
    });
  });
});

describe.only('checker', () => {
  it('process on single files correctly', done => {
    const fakeReporter = new FakeReporter();
    const pushFunction = fakeReporter.push.bind(fakeReporter);
    const spellChecker = new SpellChecker(pushFunction, pathToDict);
    const fileChecker = new FileChecker(spellChecker);
    fileChecker.checkFiles(path.resolve('./tests/fixtures/test-file-1.js')).then(() => {
      assert.equal(fakeReporter.entries.length, 1);
      done();
    });
  });

  it('process on directories correctly', done => {
    const fakeReporter = new FakeReporter();
    const pushFunction = fakeReporter.push.bind(fakeReporter);
    const spellChecker = new SpellChecker(pushFunction, pathToDict);
    const fileChecker = new FileChecker(spellChecker);
    fileChecker.checkFiles(path.resolve('./tests/fixtures')).then(() => {
      assert.equal(fakeReporter.entries.length, 2);
      done();
    });
  });
});
