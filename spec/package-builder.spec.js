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

    // await packageBuilder.getPackageSize("@angular/core", "10.1.0")
    const packageSize = await packageBuilder.getPackageSize("angular", "1.8.0");
    expect(packageSize.packageName).toEqual("angular");
    expect(packageSize.version).toEqual("1.8.0");
    expect(packageSize.size / 10000).toBeCloseTo(18.5311, 1);
    expect(packageSize.sizeGzip / 10000).toBeCloseTo(6.3645, 1);
    expect(fs.existsSync(buildpath)).toBe(false);
  });
});
