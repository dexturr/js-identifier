# js-spellcheck

Checks JavaScript identifiers for spelling mistakes. For example, if we had the following JS:

```js
    var testtVariable = 123;
```

js-spellcheck would report on this because `testt` is not a valid word in the English dictionary. 

# Advantages

There are 2 advantages to using js-spellcheck:

* Generally we eyeball spelling and humans make mistakes, using js-spellcheck automates this
* It fixes you into using a single locale for your spelling

The first is nice but the second one is where most of the power of js-spellcheck comes in, locking all code into a specific locale ensures consistency across all code files!

# TODO

This is still very WIP, expect breaking changes and bugs!

* Create a vscode integration
* Autofixing