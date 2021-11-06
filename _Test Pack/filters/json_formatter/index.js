"use strict";
const glob = require("glob");
const fs = require("fs");

const defSettings = {
  obfuscate: false,
  singleLine: false,
  comments: false,
  packs: ["RP", "BP"],
};
const settings = Object.assign(
  defSettings,
  process.argv[2] ? JSON.parse(process.argv[2]) : {}
);

const unicodeEscape = (str = "") => {
  let result = "";
  let charCode = str.charCodeAt(0);
  for (let i = 0; !isNaN(charCode); i++) {
    result += `\\u${`0000${charCode.toString(16)}`.slice(-4)}`;
    charCode = str.charCodeAt(i + 1);
  }
  return result;
};

const randomCharStr = (length) => {
  let result = "";
  const getChar = () => {
    let result = String.fromCharCode(Math.random() * 200 + 100);
    return result ? result : getChar();
  };
  for (let i = 0; i < length; i++) result += getChar();
  return result;
};

const commentLine = (str) =>
  (Math.random() > Math.random()
    ? `/*${randomCharStr(Math.random() * 40 + 5)}*/${
        Math.random() > 0.85 ? "\n" : ""
      }`
    : "") +
  str +
  (Math.random() > Math.random()
    ? `/*${randomCharStr(Math.random() * 40 + 5)}*/${
        Math.random() > 0.85 ? "\n" : ""
      }`
    : "");

function run(files) {
  files.forEach((filePath) => {
    let file = fs.readFileSync(filePath).toString();
    let contents = file.split("\n");
    let newContents = [];

    for (let i = 0; i < contents.length; i++) {
      let line = contents[i].trimRight();

      if (settings.obfuscate) {
        let matches = line.match(/".+?"/g);
        if (matches) {
          let key = matches[0].slice(1, -1);
          line = line.replace(key, unicodeEscape(key));
        }
      }
      if (settings.comments) line = commentLine(line);

      newContents.push(line.replace(/\n/g, ""));
    }

    let res = settings.singleLine
      ? newContents.map((v) => v.trim()).join("")
      : newContents.join("\n");
    fs.writeFileSync(filePath, res);
  });
}

for (let i = 0; i < settings.packs.length; i++) {
  glob(`${settings.packs[i]}/**/*.json`, null, (err, files) => {
    run(files);
  });
}
