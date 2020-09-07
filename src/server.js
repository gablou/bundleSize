require("make-promises-safe"); // installs an 'unhandledRejection' handler
const npmUtils = require("./npm-util");
const packageBuilder = require("./package-buider");

const fastify = require("fastify")({
  logger: true,
});

const queryStringJsonSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      pattern: "^(@[a-z0-9-~][a-z0-9-._~]*/)?[a-z0-9-~][a-z0-9-._~]*$", // from https://github.com/dword-design/package-name-regex
    },
  },
  required: ["name"],
};

const schema = {
  querystring: queryStringJsonSchema,
};

fastify.get(
  "/bundle-size",
  { schema, attachValidation: true },
  async (request, reply) => {
    if (request.validationError) {
      reply.code(400).send({
        statusCode: 400,
        type: "InvalidParameter",
        error: "Bad Request",
        message: request.validationError.message,
      });
    } else {
      try {
        const packageName = request.query.name;
        const versions = await npmUtils.getVersions(packageName);
        const promises = versions.map(async (version) => {
          return packageBuilder
            .getPackageSize(packageName, version)
            .then((size) => size)
            .catch(() => ({
              packageName,
              version,
              error: true,
            }));
        });
        const res = await Promise.all(promises);
        reply.send(res);
      } catch (err) {
        if (err.message === "PackageNotFoundError") {
          reply.code(400).send({
            statusCode: 400,
            type: "PackageNotFoundError",
            error: "Bad Request",
            message: "Unable to find package",
          });
        } else {
          reply.code(500).send({
            statusCode: 500,
            type: "UnknownError",
            error: "Internal Error",
            message: "Unknown Error",
          });
        }
      }
    }
  }
);

const start = async () => {
  try {
    await fastify.listen(4000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
