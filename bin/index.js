#!/usr/bin/env node
'use strict';
const program = require('commander');
const pkg = require('../package.json');
const Cli = require('../cli');

program
  .version(pkg.version)
  .usage('<files>')
  .option(
    '-l, --language <locale>',
    'the language of the dictionary to use, supported: en-GB, en-US',
    'en-GB')
  .parse(process.argv);
const cli = new Cli(program.language);

cli.processFiles(program.args[0]).then(process.exit);
