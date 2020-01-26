const chalk = require('chalk');
const apis = require('./apis');
const inquirer = require('inquirer');

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

      default:
        console.log(chalk.red(`\nOOPs! Command not found\n`));
      break;
    }

  } else if(_argv.length === 3){
    let _word = _argv[2];
    if(_word === 'play') {
      //play game
      playGame();
    } else {
      executeDefnCommand(_word);
      executeSynCommands(_word);
      excecuteAntCommand(_word);
      executeExCommand(_word);
    }
  } else if(_argv.length === 2) {
    executeRandomWordCommand();
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

function executeRandomWordCommand() {
  apis.getRandomWord().then(data => {
    data = JSON.parse(data);

    let _word = data['word'];

    console.log(chalk.blue(`Random word is "${_word}" \n`))

    executeDefnCommand(_word);
    executeSynCommands(_word);
    excecuteAntCommand(_word);
    executeExCommand(_word);
    
  }).catch(err => {
    console.log(chalk.red(`${err}`))
  })  
}

async function playGame() {
  let _display = ['defn','syn','ant'];

  let _random = Math.floor(Math.random()*_display.length);

  try {
    let _word_data = await apis.getRandomWord();
    _word_data = JSON.parse(_word_data);

    let _answer = _word_data['word'];

    let _word_definations = await apis.getWordDefinitions(_answer);
    _word_definations = JSON.parse(_word_definations);

    let _word_syn_ant = await apis.getRelativeWords(_answer);
    _word_syn_ant = JSON.parse(_word_syn_ant);

    let _word_syn = _word_syn_ant[_word_syn_ant.length-1].words;
    let _word_ant = (_word_syn_ant.length === 2) ?  _word_syn_ant[0].words: [];

    let show = "";
    if(_display[_random] === 'defn') {
      show = _word_definations[Math.floor(Math.random()*_word_definations.length)].text;
    } else if(_display[_random] === 'syn') {
      show = _word_syn[Math.floor(Math.random()*_word_syn.length)];
    } else {
      if(_word_ant.length) {
        show = _word_ant[Math.floor(Math.random()*_word_ant.length)];
      } else {
        show = _word_syn[Math.floor(Math.random()*_word_syn.length)];
      }
    }

    let user_inp = {};

    while(true) {
      user_inp = await getUserInput(show,_display[_random]);

      let answer_is = false;
      for(let i=0;i<_word_syn.length;i++) {
        if(_word_syn[i] === user_inp.user_answer) {
          console.log(chalk.green(`Congratulations! you got that right`));
          answer_is = true;
        }
      }      

      if(!answer_is) {
        //wrong answer
        console.log(chalk.red(`Sorry! That is a wrong answer!`))

        user_inp = await onUserFail();

        if(user_inp.user_action === 'Quit') {
          break;
        } else if(user_inp.user_action === 'Get Hint') {
          getHint(_word_definations,_word_syn,_word_ant,_answer);
        }
      } else {
        console.log(chalk.green(`\nThanks for playing! see you soon!`))
        break;
      }

    }
    
  } catch(err) {
    console.log(chalk.red(`${err}`));
  }
}

function getUserInput(show,_type,_correct_answers) {
  let type = {
    'defn': 'defination',
    'syn': 'synonym',
    'ant': 'antonym'
  };

  const query = [
    {
      name: 'user_answer',
      type: 'input',
      message: `Guess the word for the given ${type[_type]}\n\n  ${show}`,
      validate: (value) => {
        return true;
      }
    }
  ];

  return inquirer.prompt(query);
}

function onUserFail() {
  const query = [
    {
      type: 'list',
      name: 'user_action',
      message: `What do you want to do now ?`,
      choices: ['Try Again','Get Hint','Quit'],
      default: ['Try Again'],
      validate: (value) => {
        return true;
      }
    }
  ];

  return inquirer.prompt(query);
}

function getHint(_word_definations,_word_syn,_word_ant,_answer) {
  let hint_type = ['shfl','dfn','syn','ant'];
  let text = {
    'shfl' : 'Shuffled word is ',
    'dfn' : 'Defination for the word is ',
    'syn' : 'Synonym for the word is ',
    'ant' : 'Antonym for the word is '
  };

  let _random = Math.floor(Math.random()*hint_type.length)

  let showing_hint = "";
  if(hint_type[_random] === 'shfl') {
    showing_hint = shuffelWord(_answer);
  } else if(hint_type[_random] === 'dfn') {
    showing_hint = _word_definations[Math.floor(Math.random()*_word_definations.length)].text;
  } else if(hint_type[_random] === 'syn'){
    showing_hint = _word_syn[Math.floor(Math.random()*_word_syn.length)];
  } else {
    if(_word_ant.length) {
      showing_hint = _word_ant[Math.floor(Math.random()*_word_ant.length)];
    } else {
      showing_hint = _word_syn[Math.floor(Math.random()*_word_syn.length)];
      hint_type[_random] = 'syn';
    }
  }

  console.log(chalk.yellow(`\n\n${text[hint_type[_random]]} \n ${showing_hint}\n\n`))
}

function shuffelWord (word){
  var shuffledWord = '';
  word = word.split('');
  while (word.length > 0) {
    shuffledWord +=  word.splice(word.length * Math.random() << 0, 1);
  }
  return shuffledWord;
}

module.exports = processInputCommand;
