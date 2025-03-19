/* eslint-disable global-require */
module.exports = (on) => {
  on('task', require('@cypress/code-coverage/task'));
};
