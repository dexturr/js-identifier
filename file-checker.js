'use strict';
const globby = require('globby');
const fs = require('fs');

const readFileAsync = filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, { encoding: 'UTF-8' }, (err, buffer) => {
    if (err) {
      reject(err);
    }
    resolve(buffer);
  });
});

module.exports = class FileSpellChecker {

  constructor(spellChecker) {
    this.spellChecker = spellChecker;
  }

  getFilePath(filePath) {
    if (fs.lstatSync(filePath).isDirectory()) {
      return `${filePath}/**/*.js`;
    } else if (filePath.endsWith('.js')) {
      return filePath;
    } else {
      throw new Error(`Could not find path ${filePath}`);
    }
  }

  async checkFile(filePath) {
    const text = await readFileAsync(filePath);
    this.spellChecker.checkText(text);
  }

  async checkFiles(path) {
    const globbyPath = this.getFilePath(path);
    const files = await globby([globbyPath, `!${path}/node_modules/**/*.js`]);
    const promiseArray = files.map(file => this.checkFile(file));
    await Promise.all(promiseArray);
  }
};
