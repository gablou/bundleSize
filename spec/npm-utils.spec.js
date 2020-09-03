const NpmUtils = require("../src/npm-util");
const mkdir = require("mkdir-promise");
const path = require("path");
const rimraf = require("rimraf");
var fs = require("fs");

describe("When parsing node versions stdout", () => {
  describe("for less than 3 versions", () => {
    it("should return same version list", () => {
      expect(NpmUtils.parseVersion('["1.0.0"]')).toEqual(["1.0.0"]);
      expect(NpmUtils.parseVersion('["1.0.0", "3.0.0", "4.0.0"]')).toEqual([
        "1.0.0",
        "3.0.0",
        "4.0.0",
      ]);
    });

    it("should reoarder list", () => {
      expect(NpmUtils.parseVersion('["3.0.0", "2.0.0", "1.0.0"]')).toEqual([
        "1.0.0",
        "2.0.0",
        "3.0.0",
      ]);
      expect(NpmUtils.parseVersion('["2.10.0", "2.2.0", "2.1.0"]')).toEqual([
        "2.1.0",
        "2.2.0",
        "2.10.0",
      ]);
    });
  });

  describe("3 last verions and a previous major", () => {
    it("should return 4 versions", () => {
      expect(
        NpmUtils.parseVersion('["1.0.1", "3.0.0", "4.0.0", "2.0.0", "1.0.0"]')
      ).toEqual(["1.0.1", "2.0.0", "3.0.0", "4.0.0"]);
      //["1.2.1", "1.10.0", "3.0.0", "2.0.0", "2.1.0-rc.1"]
    });
  });

  describe("3 last verions no previous major", () => {
    it("should return 3 versions", () => {
      expect(
        NpmUtils.parseVersion('["1.2.1", "1.10.0", "3.0.0", "2.1.0"]')
      ).toEqual(["1.10.0", "2.1.0", "3.0.0"]);
    });
  });
});

describe("install package", () => {
  let originalTimeout;
  beforeAll(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
  });

  afterAll(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it("should install", async () => {
    let buildpath = path.join("/tmp", "1");
    await mkdir(buildpath);

    await NpmUtils.installPackage("react", "16.3.0-alpha.1", buildpath);
    expect(fs.existsSync(path.join(buildpath, "node_modules"))).toBe(true);
    //clean up
    rimraf.sync(buildpath);
    expect(fs.existsSync(path.join(buildpath))).toBe(false);
  });
});
