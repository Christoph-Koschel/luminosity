const fs = require("fs");
const path = require("path");

const data = {};
const R = {};

exports.make_vfs = function make_vfs(dir, currentR = R) {
    fs.readdirSync(dir).forEach(item => {
        const p = path.join(dir, item);
        if (fs.statSync(p).isDirectory()) {
            currentR[item] = {};
            make_vfs(p, currentR[item]);

        } else {
            currentR[item] = p.replace(/\\/gi, "/");
            data[p.replace(/\\/gi, "/")] = fs.readFileSync(p).toString("base64");
        }
    });
}

exports.write_vfs = function () {
    const loop1 = (keys, root) => {
        const items = [];

        for (let i = 0; i < keys.length; i++) {
            if (typeof root[keys[i]] == "string") {
                items.push(`${keys[i].replace(path.extname(keys[i]), "")}: string`);
            } else {
                items.push(`${keys[i]}: {${loop1(Object.keys(root[keys[i]]), root[keys[i]]).join(", ")}}`);
            }
        }

        return items;
    };
    const loop2 = (keys, root) => {
        const items = [];

        for (let i = 0; i < keys.length; i++) {
            if (typeof root[keys[i]] == "string") {
                items.push(`${keys[i].replace(path.extname(keys[i]), "")}: "${root[keys[i]].replace(path.extname(keys[i]), "")}"`);
            } else {
                items.push(`${keys[i]}: {${loop2(Object.keys(root[keys[i]]), root[keys[i]]).join(", ")}}`);
            }
        }

        return items;
    };

    const rType = `{${loop1(Object.keys(R), R).join(", ")}};`;
    const rTypeValue = `{${loop2(Object.keys(R), R).join(", ")}};`;

    fs.writeFileSync("./src/luminosity/vfs.ts", `export type RType = ${rType}
export const R: RType = ${rTypeValue}
    `);

    fs.writeFileSync("./src/vfs/content.ts", `export const VFS: Map<string, string> = new Map<string, string>();
${Object.keys(data).map((value, key) => `VFS.set("${value.replace(path.extname(value), "")}", "${data[value]}");`).join("\n")}
    `);
}
