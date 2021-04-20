// @ts-ignore
import brfs from "brfs";
import browserify from "browserify";
// @ts-ignore
import esmify from "esmify";
import * as fs from "fs";
import { Stream } from "node:stream";

const waitStreamClose = (stream: Stream): Promise<void> => {
    return new Promise((resolve) => stream.on("close", () => {
        return resolve();
    }));
}

const compile = async (file: string, fullPath: string) => {
    console.log(`Browserify ${fullPath}/${file}...`);

    const tmpOutFileName = `browserify.${file}`;

    const outStream = fs.createWriteStream(tmpOutFileName, { flags: "w+" });

    browserify(file)
        .plugin(esmify)
        .transform(brfs)
        .bundle()
        .pipe(outStream);

    await waitStreamClose(outStream);

    // Execute script api returned promise will resolve as last executed item's value in script code
    // so add a null to let this promise success.
    // See: https://stackoverflow.com/questions/44567525
    fs.appendFileSync(tmpOutFileName, "null;\n")

    fs.rmSync(file);
    fs.renameSync(tmpOutFileName, file);
}

const compileFolder = async (path: string, fullPath?: string) => {
    process.chdir(path);

    if (!fullPath) {
        fullPath = path;
    }

    const folder = await fs.promises.opendir(".");

    for await (const file of folder) {
        if (file.isDirectory()) {
            await compileFolder(file.name, fullPath + '/' + file.name);
        } else if (file.name.endsWith(".js")) {
            await compile(file.name, fullPath);
        }
    }

    process.chdir("..");
}

process.chdir("dist/content");

compileFolder(".", "dist/content").then(() => {
    console.log("All done.");
});
