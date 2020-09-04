const { exec } = require("./utils");
const path = require("path");
const semver = require("semver");

function ExceptionNpm(message) {
  this.message = message;
}

const NpmUtils = {
  /**
   * return list of 3 last vestions and previous major if any
   *
   * @param {string} packageName
   * @return {Promise<Array>}
   */
  getVersions(packageName) {
    return exec(`npm view ${packageName} versions --json`)
      .then(this.parseVersion)
      .catch(this.parseError);
  },

  /**
   *
   *
   * @param {stirng} packageName
   * @param {string} version
   * @param {string} buildPath path where package should be installed
   * @return {Promise<void>}
   */
  async installPackage(packageName, version, buildPath) {
    console.log("install in :", buildPath);
    const flags = [
      // Setting cache is required for concurrent `npm install`s to work
      `cache=${path.join(buildPath, "cache")}`,
      "no-package-lock",
      "no-shrinkwrap",
      "no-optional",
      "no-bin-links",
      "prefer-offline",
      "progress false",
      "loglevel error",
      "ignore-scripts",
      "save-exact",
      "production",
      `prefix ${buildPath}`,
    ];
    return exec(
      `npm install ${packageName}@${version} --${flags.join(" --")}`,
      { cwd: buildPath }
    )
      .then(() => {
        console.log(`${packageName}@${version} installed`);
      })
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
