'use strict';

const simpleSpellChecker = require('simple-spellchecker');
const path = require('path');
const recast = require('recast');
const camelCase = require('camelcase');
const snakeCase = require('to-snake-case');

const pathToDict = path.resolve('./node_modules/simple-spellchecker/dict');

module.exports = class SpellChecker {

  constructor(reporter) {
    this.dictionary = simpleSpellChecker.getDictionarySync('en-GB', pathToDict);
    this.reporter = reporter;
  }

  checkText(text) {
    const ast = recast.parse(text);
    const checkIdentifier = this.checkIdentifier.bind(this);
    const { reporter } = this;
    recast.visit(ast, {
      visitIdentifier({ value: { name } }) {
        // Variable could be in any case. Camelcase it for consistency.
        const camelCasedName = camelCase(name);
        const snakedName = snakeCase(name);
        const words = snakedName.split('_');
        for (const word of words) {
          const result = checkIdentifier(word);
          if (result.misspelled) {
            reporter(result.suggestions);
          }
        }
        return false;
      },
    });
  }

  checkIdentifier(idenifiter) {
    let misspelled = !this.dictionary.spellCheck(idenifiter);
    if (misspelled) {
      return {
        misspelled,
        suggestions: this.dictionary.getSuggestions(idenifiter),
      };
    }
    return {
      misspelled,
      suggestions: [],
    };
  }

};
