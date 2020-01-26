//@ts-check
const apis = require('./apis');
const chalk = require('chalk');

function relativeWordsProcess(data,_word,_type) {
  let syn_found = false;

  for(let i=0;i<data.length;i++) {
    if(data[i].relationshipType === _type) {
      syn_found = true;
      console.log(`\n${_type}s for the word ${_word} are as follows : \n`);
      for(let j=0;j<data[i].words.length;j++) {
        console.log(chalk.blue(`${data[i].words[j]}`));
      }
      break;
    }
  }

  if(!syn_found) {
    console.log(chalk.red(`\nNo ${_type}s were found for "${_word}"`))
  }
}

module.exports = {
  executeDefnCommand: (_word) => {
    apis.getWordDefinitions(_word).then((data) => {
      data = JSON.parse(data);
  
      if(data.length) {
        console.log(`Here are the found definations for ${_word}: \n`);
  
        for(let i=0;i<data.length;i++) {
          console.log(chalk.blue(data[i].text));
        }
      } else {
        console.log(chalk.red(`No definations were found for "${_word}"`));
      }
  
    }).catch(err => {
      console.log(chalk.red(`${err}`));
    })
  },

  executeSynCommands: (_word) => {
    apis.getRelativeWords(_word).then(data => {
      data = JSON.parse(data);
  
      relativeWordsProcess(data,_word,'synonym');
  
    }).catch(err => {
      console.log(chalk.red(`${err}`));
    });
  },

  excecuteAntCommand: (_word) => {
    apis.getRelativeWords(_word).then(data => {
      data = JSON.parse(data);
  
      relativeWordsProcess(data,_word,'antonym');
  
    }).catch(err => {
      console.log(chalk.red(`${err}`));
    });    
  },

  executeExCommand: (_word) => {
    apis.getWordExamples(_word).then(data => {
      data = JSON.parse(data);
  
      if(data.examples.length) {
        console.log(`\nHere are some examples for the word "${_word}"\n`);
        for(let i=0;i<data.examples.length;i++) {
          console.log(chalk.blue(`${i+1}). ${data.examples[i].text}\n`));
        }
      } else {
        console.log(chalk.red(`No examples were found for the word "${_word}"`));
      }
    }).catch(err => {
      console.log(chalk.red(`${err}`));
    })
  }
};