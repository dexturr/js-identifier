'use strict';

const simpleSpellChecker = require('simple-spellchecker');
const recast = require('recast');
const camelCase = require('camelcase');
const snakeCase = require('to-snake-case');

module.exports = class SpellChecker {

  constructor(reporter, pathToDictionary, locale = 'en-GB') {
    this.dictionary = simpleSpellChecker.getDictionarySync(locale, pathToDictionary);
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
        const snakedName = snakeCase(camelCasedName);
        const words = snakedName.split('_');
        for (const word of words) {
          const result = checkIdentifier(word);
          if (result.misspelled) {
            reporter(result);
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
        original: idenifiter,
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
