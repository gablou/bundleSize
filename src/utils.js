const childProcess = require("child_process");

/**
 *
 *
 * @param {string} command to execute
 * @param {ExecOptions} options
 * @return {Promise<stirng>}
 */
function exec(command, options) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, options, function(error, stdout, stderr) {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

module.exports = { exec };
