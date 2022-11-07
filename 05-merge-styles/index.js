const fs = require("fs/promises");
// const path = require("path");
const path = require("path");
const { createWriteStream, createReadStream } = require("fs");

const projectDist = path.join(__dirname, "project-dist");
const bundlePath = path.join(projectDist, "bundle.css");
const styleSource = path.join(__dirname, "styles");

async function getCssFileNames(folder) {
  let files = await fs.readdir(folder);
  let cssFileNames = [];
  for (let file of files) {
    let filePath = path.join(folder, file);
    let fileData = path.parse(filePath);
    let fileStats = await fs.stat(filePath);
    if (fileStats.isFile() && fileData.ext === ".css")
      cssFileNames.push({ fileName: file, filePath });
  }
  return cssFileNames;
}

async function createBundle(styleSrc, bundle) {
  let cssFileNames = await getCssFileNames(styleSrc);
  const writeStream = createWriteStream(bundle, "utf-8");
  for (let file of cssFileNames) {
    const readStream = createReadStream(file.filePath, "utf-8");
    readStream.on("close", () =>
      console.log(`Finish reading ${file.fileName}`)
    );
    readStream.pipe(writeStream);
  }
  writeStream.on("close", () => {
    console.log(`Finish writing bundle`);
  });
}

createBundle(styleSource, bundlePath);
