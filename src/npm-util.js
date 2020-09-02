const { exec } = require("./utils");
const semver = require("semver");

function ExceptionNpm(message) {
  this.message = message;
}

const NpmUtils = {
  /**
   *
   *
   * @param {*} packageName
   * @return {Promise<Array>}
   */
  getVersions(packageName) {
    return exec(`npm view ${packageName} versions --json`)
      .then(this.parseVersion)
      .catch(this.parseError);
  },

  /**
   * parse npm eror output for some error
   *
   * @param {string} sdtout
   */
  parseVersion(sdtout) {
    const versions = JSON.parse(sdtout).sort(semver.compare);
    if (versions.length <= 3) {
      return versions;
    } else {
      let versionsList = versions.slice(-3);
      let previousMajor = semver.maxSatisfying(
        versions,
        `<${semver.major(versionsList[0])}`
      );
      if (previousMajor) {
        versionsList.unshift(previousMajor);
      }
      return versionsList;
    }
  },

  /**
   * parse npm eror output for some error
   *
   * @param {string} errorStr
   */
  parseError(errorStr) {
    if (errorStr.includes("code E404")) {
      throw new ExceptionNpm("PackageNotFoundError");
    } else {
      throw new ExceptionNpm("UnknowError");
    }
  },
};

module.exports = NpmUtils;
