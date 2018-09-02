'use strict';
const FileChecker = require('./file-checker');
const SpellChecker = require('./index');
const path = require('path');
const pathToDict = path.resolve(path.join(__dirname, './dictionaries'));

class FakeReporter {

  constructor() {
    this.entries = [];
  }

  push(entry) {
    console.log(entry);
    this.entries.push(entry);
  }
}

module.exports = class {

  constructor(dictionaryName, pathToDictionary = pathToDict) {
    const fakeReporter = new FakeReporter();
    const pushFunction = fakeReporter.push.bind(fakeReporter);
    const spellChecker = new SpellChecker(pushFunction, pathToDictionary, dictionaryName);
    const fileChecker = new FileChecker(spellChecker);
    this.fileChecker = fileChecker;
  }

  processFiles(files) {
    return this.fileChecker.checkFiles(files);
  }
};
