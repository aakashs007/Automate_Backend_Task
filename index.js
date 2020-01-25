#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');

/** in-house dependencies **/
const configs = require('./config');
const apis = require('./src/apis');
/** in-house dependencies **/

clear();

console.log(
  chalk.green(
    figlet.textSync('CL Dictionary Tool', { horizontalLayout: 'full' })
  )
);
