#!/usr/bin/env zx

const [fileName, property, value] = argv._;

$`echo "${fileName} ${property} ${value}" >> tmp.txt`;

if (!(await fs.pathExists(fileName))) {
    process.exit(3);
}

const file = await fs.promises.readFile(fileName);

const json = JSON.parse(file);

json[property] = value;

await fs.writeFile(fileName, JSON.stringify(json, null, '  '));

export { }