const glob = require("glob");
const fs = require("fs");

const defSettings = {
  enforceJSImports: false,
  enforceExceptions: ["mojang-minecraft", "mojang-gametest"],
  singleLine: false,
  scriptPaths: ["BP/**/*.js"],
};
const settings = Object.assign(
  defSettings,
  process.argv[2] ? JSON.parse(process.argv[2]) : {}
);

function endsWithAny(str, strs) {
  return strs.some((v) => str.endsWith(v));
}

function isEnded(str) {
  return endsWithAny(str, [
    "{",
    "}",
    "(",
    ")",
    "[",
    "]",
    ";",
    "if",
    "else",
    ",",
    "`",
    '"',
    "'",
  ]);
}

function enforceJSImports(contents) {
  let newContents = [];
  contents = contents.split("\n");
  for (let i = 0; i < contents.length; i++) {
    let line = contents[i].trim() + "";
    if (
      !line.startsWith("import") ||
      settings.enforceExceptions.some(
        (v) =>
          line.includes(`"${v}"`) || line.includes(`'${v}'`) || line.includes(`\`${v}\``)
      )
    ) {
      newContents.push(`${line}\n`);
      continue;
    }
    let nonSemicolonFound = false;
    for (let i0 = line.length - 1; i0 >= 0; i0--) {
      if (line[i0] !== ";") nonSemicolonFound = true;
      if (!nonSemicolonFound) continue;
      let p0 = line.slice(0, i0);
      if (!p0.endsWith(".js")) {
        let p1 = line.slice(i0);
        line = `${p0}.js${p1}`;
      }
      break;
    }
    newContents.push(`${line}\n`);
  }
  return newContents.join("");
}

function singleLineify(contents) {
  contents = contents.split("\n");
  let newContents = [contents[0].trim()];
  for (let i = 1; i < contents.length; i++) {
    let line = contents[i].trim();
    let prevLine = newContents[newContents.length - 1];
    if (!line) continue;
    try {
      if (isEnded(prevLine) && !prevLine.includes("//")) {
        newContents.push(` ${line}`);
      } else newContents.push(`\n${line}`);
    } catch (err) {
      console.log(line);
      throw err;
    }
  }
  return newContents;
}

function run(files) {
  files.forEach((filePath) => {
    let file = fs.readFileSync(filePath).toString();
    if (settings.enforceJSImports) file = enforceJSImports(file);
    if (settings.singleLine) file = singleLineify(file);

    fs.writeFileSync(filePath, typeof file === "string" ? file : file.join(""));
  });
}

for (let i = 0; i < settings.scriptPaths.length; i++) {
  glob(settings.scriptPaths[i], null, (err, files) => {
    run(files);
  });
}
