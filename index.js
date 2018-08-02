'use strict';

const { exec } = require('child_process');
const AWS = require('aws-sdk');

const promisexec = (command) => new Promise((resolve, reject) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {reject(new Error(error));}
    else if (stderr) {reject(new Error(stderr));}
    else {resolve(stdout.trim());}
  });
});

class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.commands = {};

    this.hooks = {
      'deploy:finalize': this.updateGitDescriptionToSsm.bind(this)
    };
  }

  updateGitDescriptionToSsm() {
    this.serverless.cli.log('SSM API git version: Acquiring git description...');

    const region = this.serverless.service.provider.region;

    const SSM = new AWS.SSM({ region });

    const putSsmParameter = (name, value) => new Promise((resolve, reject) => {
      var params = {
        Name: name,
        Type: 'String',
        Value: value,
        Overwrite: true
      };
      SSM.putParameter(params, (err, data) => {
        if (err) {reject(err);}
        else {resolve(data);}
      });
    });


    return promisexec('git describe --tags')
      .then(value => {
        const ssmPrefix = this.serverless.service.custom.ssmApiGitVersion.ssmPrefix || '/api-gateway/versions/';
        const name = ssmPrefix + this.serverless.service.service;

        this.serverless.cli.log(`SSM API git version: Updating git description '${value}' to SSM with key '${name}' at region ${region}`);

        return putSsmParameter(name, value);
      });
  }
}

module.exports = ServerlessPlugin;
