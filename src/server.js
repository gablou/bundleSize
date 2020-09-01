require("make-promises-safe"); // installs an 'unhandledRejection' handler
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

fastify.get("/bundle-size", { schema }, async (request, reply) => {
  return { hello: "world" };
});

const start = async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
