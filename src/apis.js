const configs = require('../config').getEnvs();
const request = require('request');
const CLI = require('clui');
const Spinner = CLI.Spinner;

class API {

  constructor() {
    this.base_url = 'https://fourtytwowords.herokuapp.com';
  }
  
  baseCall(_request_type,_url) {
    let api_end_point = `${this.base_url}${_url}?api_key=${configs.api_key}`;

    let options = {
      uri: api_end_point,
      method: _request_type,
    }

    const status = new Spinner('Fetching data, please wait...');
    status.start();

    return new Promise((resolve,reject) => {
      request(options,(err,res,body) => {
        if(!err) {
          resolve(body);
        } else {
          reject(err);
        }        
        status.stop();        
      });
    });
  }

  async getRandomWord() {
    let path = '/words/randomWord';

    try {
      const response = await this.baseCall('GET',path);
      return response;
    } catch(err) {
      console.log(`Error Occured in api calling ${err}`)
    }
  }

  async getWordDefinitions(_word) {
    let path = `/word/${_word}/definitions`;

    try {
      const response = await this.baseCall('GET',path);
      return response;
    } catch(err) {
      console.log(`Error Occured in api calling ${err}`)
    }
  }
  
  async getWordExamples(_word) {
    let path = `/word/${_word}/examples`;

    try {
      const response = await this.baseCall('GET',path);
      return response;
    } catch(err) {
      console.log(`Error Occured in api calling ${err}`)
    }
  }

  async getRelativeWords(_word) {
    let path = `/word/${_word}/relatedWords`;
    
    try {
      const response = await this.baseCall('GET',path);
      return response;
    } catch(err) {
      console.log(`Error Occured in api calling ${err}`)
    }
  }

}

module.exports = new API;