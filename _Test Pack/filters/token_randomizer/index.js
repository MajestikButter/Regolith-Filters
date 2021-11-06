"use strict";
const glob = require("glob");
const fs = require("fs");

const defSettings = {
  keepNamespace: true,
  animations: false,
  items: false,
  blocks: false,
  entities: false,
  exceptions: [],
};
const settings = Object.assign(
  defSettings,
  process.argv[2] ? JSON.parse(process.argv[2]) : {}
);

let tokenMap = {
  entity: {},
  block: {},
  item: {},
};

const randCharStr = (len) => {
  let res = "";
  const getChar = () => {
    let res = String.fromCharCode(Math.random() * 25 + 97);
    return res ? res : getChar();
  };
  for (let i = 0; i < len; i++) res += getChar();
  return res;
};

function getToken(id, type, shouldNamespace = true) {
  if (tokenMap[type][id]) return tokenMap[type][id];

  const create = () => {
    let res = shouldNamespace
      ? `${
          settings.keepNamespace ? id.split(":")[0] : randCharStr(4)
        }:${randCharStr(15)}`
      : randCharStr(15);

    if (Object.values(tokenMap[type]).includes(res)) res = create();
    return res;
  };

  let newTk = create();
  tokenMap[type][id] = newTk;
  return newTk;
}

const passes = [
  (filePath) => {
    let file = fs.readFileSync(filePath).toString();
    let json = JSON.parse(file);

    function token(key, type, config) {
      if (json[key])
        return getToken(json[key].description.identifier, type, config);
    }
    const e = [
      ["minecraft:block", "block", settings.blocks],
      ["minecraft:client_entity", "entity", settings.entities],
      ["minecraft:entity", "entity", settings.entities],
      ["minecraft:item", "item", settings.items],
    ];
    for (let v of e) token(...v);
    console.log(tokenMap);
  },
  (filePath) => {},
];

for (let i = 0; i < 2; i++) {
  glob("**/*.json", null, (err, files) => {
    files.forEach((filePath) => {
      passes[i](filePath);
    });
  });
}
