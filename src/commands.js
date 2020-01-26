const chalk = require('chalk');
const apis = require('./apis');

function processInputCommand(_argv) { 
  if(_argv.length === 4) {
    let _command = _argv[2];
    let _word = _argv[3];

    switch (_command) {
      case 'defn':
        executeDefnCommand(_word);
      break;
  
      case 'syn':
        executeSynCommands(_word);
      break;
  
      case 'ant':
        excecuteAntCommand(_word);     
      break;
  
      case 'ex':
        executeExCommand(_word);
      break;
    }

  } else if(_argv.length === 3){
    let _word = _argv[2];
    if(_word !== 'play') {
      executeDefnCommand(_word);
      executeSynCommands(_word);
      excecuteAntCommand(_word);
      executeExCommand(_word);
    } else {
      //play game

    }
  } else if(_argv.length === 2) {
    apis.getRandomWord().then(data => {
      data = JSON.parse(data);

      let _word = data['word'];

      console.log(chalk.blue(`Random word is "${_word}" \n`))
      executeDefnCommand(_word);
      executeSynCommands(_word);
      excecuteAntCommand(_word);
      executeExCommand(_word);

    }).catch(err => {

    })
  }

}

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

function executeDefnCommand(_word) {
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
}

function executeSynCommands(_word) {
  apis.getRelativeWords(_word).then(data => {
    data = JSON.parse(data);

    relativeWordsProcess(data,_word,'synonym');

  }).catch(err => {
    console.log(chalk.red(`${err}`));
  });
}

function excecuteAntCommand(_word) {
  apis.getRelativeWords(_word).then(data => {
    data = JSON.parse(data);

    relativeWordsProcess(data,_word,'antonym');

  }).catch(err => {
    console.log(chalk.red(`${err}`));
  });
}

function executeExCommand(_word) {
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

module.exports = processInputCommand;
