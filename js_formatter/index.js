const glob = require("glob");
const fs = require("fs");

const defSettings = {
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
  return newContents.join("");
}

function run(files) {
  files.forEach((filePath) => {
    let file = fs.readFileSync(filePath).toString();
    if (settings.singleLine) file = singleLineify(file);

    fs.writeFileSync(filePath, file);
  });
}

for (let i = 0; i < settings.scriptPaths.length; i++) {
  glob(settings.scriptPaths[i], null, (err, files) => {
    run(files);
  });
}
