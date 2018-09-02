# js-spellcheck

Checks JavaScript idenitifers for spelling mistakes. For example, if we had the folllowing JS:

```js
    var testtVariable = 123;
```

js-spellcheck would report on this becuase `testt` is not a valid word in the english dictionary. 

# Advantages

There are 2 advantages to using js-spellcheck:

* Generally we eyeball spelling and humans make mistakes, using js-spellcheck automates this
* It fixes you into using a single locale for your spelling

The first is nice but the second one is where most of the power of js-spellcheck comes in, locking all code into a specific locale ensures consistency across all code files!