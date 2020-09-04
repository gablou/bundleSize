const packageBuilder = require("../src/package-buider");
const path = require("path");
var fs = require("fs");

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
    const buildpath = path.join(process.cwd(), "tmp", "1");

    expect(await packageBuilder.getPackageSize("angular", "1.8.0")).toEqual({
      packageName: "angular",
      version: "1.8.0",
      size: 185311,
      sizeGzip: 63645,
    });
    expect(fs.existsSync(buildpath)).toBe(false);
  });
});
