const NpmUtils = require("./npm-util");
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const mkdir = require("mkdirp");
const TerserPlugin = require("terser-webpack-plugin");
const gzipSize = require("gzip-size");
const rimraf = require("rimraf");

const PackageBuilder = {
  async getPackageSize(packageName, version) {
    const buildPath = path.join(process.cwd(), "tmp", "1");
    const distPath = path.resolve(buildPath, "dist");
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
          reject(err);
        }
        resolve();
      });
    });

    const bundledFile = path.join(distPath, "main.js");
    const size = fs.statSync(bundledFile).size;
    const sizeGzip = gzipSize.fileSync(bundledFile);

    rimraf.sync(buildPath); //clean up
    return {
      packageName,
      version,
      size,
      sizeGzip,
    };
  },

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

  createWebPackConfig(buildPath, packageName) {
    const entryPoint = path.join(buildPath, "index.js");
    try {
      fs.writeFileSync(
        entryPoint,
        `const webpack = require("${packageName}");`
      );
      return entryPoint;
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = PackageBuilder;
