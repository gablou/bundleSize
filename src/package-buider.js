const NpmUtils = require("./npm-util");
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const mkdir = require("mkdirp");
const TerserPlugin = require("terser-webpack-plugin");
const gzipSize = require("gzip-size");
const rimraf = require("rimraf");

const PackageBuilder = {
  /**
   * @typedef PackageSize
   * @type {object}
   * @property {string} packageName
   * @property {string} version
   * @property {number} size size in bytes
   * @property {number} sizeGzip siez in bytes
   */
  /**
   * return sizes for a specific version
   *
   * @param {string} packageName
   * @param {string} version
   * @return {Promise<PackageSize>}
   */
  async getPackageSize(packageName, version) {
    let size, sizeGzip;
    const id = String(Math.floor(Math.random() * 100000));
    const buildPath = path.join(process.cwd(), "tmp", id);
    const distPath = path.resolve(buildPath, "dist");
    try {
      await mkdir(buildPath);
      await NpmUtils.installPackage(packageName, version, buildPath);
      const entry = this.createEntryFile(buildPath, packageName);
      const compiler = webpack({
        mode: "production",
        entry,
        output: {
          filename: "main.js",
          path: distPath,
        },
        optimization: {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              parallel: true,
              terserOptions: {
                ie8: false,
                output: {
                  comments: false,
                },
              },
            }),
          ],
        },
      });
      await new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
          if (err) {
            console.log(err);
            reject();
          }
          if (stats.compilation.errors.length) {
            console.log(stats.compilation.errors);
            reject();
          }
          resolve();
        });
      });

      const bundledFile = path.join(distPath, "main.js");
      size = fs.statSync(bundledFile).size;
      sizeGzip = gzipSize.fileSync(bundledFile);
      rimraf.sync(buildPath); //clean up
    } catch (err) {
      rimraf.sync(buildPath); //clean up
      throw err;
    }
    return {
      packageName,
      version,
      size,
      sizeGzip,
    };
  },

  /**
   * create entry file that will be bundeled
   *
   * @param {stirng} buildPath
   * @param {string} packageName
   * @return {void}
   */
  createEntryFile(buildPath, packageName) {
    const entryPoint = path.join(buildPath, "index.js");
    try {
      fs.writeFileSync(
        entryPoint,
        `import p from '${packageName}'; console.log(p)`
      );
      return entryPoint;
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = PackageBuilder;
