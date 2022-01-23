const glob = require("glob");
const fs = require("fs");

const defSettings = {
  removeGlob: "",
  ignoreGlob: [],
  buildOptions: {
    external: ["mojang-minecraft", "mojang-gametest"],
    entryPoints: ["src/index.ts"],
    outfile: "./scripts/index.js",
    target: "es2020",
    format: "esm",
    bundle: true,
    minify: true,
  },
};
const settings = Object.assign(
  defSettings,
  process.argv[2] ? JSON.parse(process.argv[2]) : {}
);
const typeMap = {
  removeGlob: "string",
  ignoreGlob: "array",
  buildOptions: "object",
};
const throwTypeError = (k) => {
  throw new TypeError(
    `${k}: ${JSON.stringify(settings[k])} is not an ${typeMap[k]}`
  );
};
for (let k in typeMap) {
  if (typeMap[k] === "array") {
    if (!Array.isArray(settings[k])) throwTypeError(k);
  } else if (typeMap[k] === "object") {
    if (Array.isArray(settings[k])) throwTypeError(k);
  } else if (typeof settings[k] !== typeMap[k]) throwTypeError(k);
}

require("esbuild")
  .build(settings.buildOptions)
  .then(() => {
    if (settings.removeGlob) {
      glob(
        settings.removeGlob,
        {
          ignore: settings.ignoreGlob,
        },
        (err, matches) => {
          matches.forEach(() => fs.unlinkSync());
        }
      );
    }
  })
  .catch(() => process.exit(1));
