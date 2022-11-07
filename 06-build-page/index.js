const fs = require("fs/promises");
const { createWriteStream, createReadStream } = require("fs");
const path = require("path");

const distFolderName = "project-dist";
const projectDistPath = path.join(__dirname, distFolderName);
const assetsFolderName = "assets";
const assetsFolderPath = path.join(__dirname, assetsFolderName);
const cssBundlePath = path.join(projectDistPath, "style.css");
const styleSource = path.join(__dirname, "styles");
const newAssetsFolderPath = path.join(
  __dirname,
  distFolderName,
  assetsFolderName
);
const htmlTemplatePath = path.join(__dirname, "template.html");
const htmlCompotentsPath = path.join(__dirname, "components");

async function makeFolder(newAssetsFolderPath) {
  await fs.rm(newAssetsFolderPath, { force: true, recursive: true });
  await fs.mkdir(newAssetsFolderPath, { recursive: true });
}

async function copyFiles(src, dest) {
  await makeFolder(dest);
  let files = await fs.readdir(src, { withFileTypes: true });
  files.forEach(async (file) => {
    let filePath = path.join(src, file.name);
    let destPath = path.join(dest, file.name);
    if (file[Object.getOwnPropertySymbols(file)[0]] === 2) {
      copyFiles(filePath, destPath);
    } else {
      await fs.copyFile(filePath, destPath);
    }
  });
}

async function getFilesWithExt(folder, ext) {
  let files = await fs.readdir(folder);
  let fileNames = [];
  for (let file of files) {
    let filePath = path.join(folder, file);
    let fileData = path.parse(filePath);
    let fileStats = await fs.stat(filePath);
    if (fileStats.isFile() && fileData.ext === ext)
      fileNames.push({
        nameWtihoutExt: fileData.name,
        fileName: file,
        filePath,
      });
  }
  return fileNames;
}

async function createBundle(styleSrc, bundle) {
  let cssFileNames = await getFilesWithExt(styleSrc, ".css");
  const writeStream = createWriteStream(bundle, "utf-8");
  for (let file of cssFileNames) {
    const readStream = createReadStream(file.filePath, "utf-8");
    readStream.pipe(writeStream);
  }
  writeStream.on("close", () => {
    console.log(`Finish building css bundle`);
  });
}

async function buildHtmlBundle(
  htmlTemplatePath,
  htmlCompotentsPath,
  outputPath
) {
  let htmlTemplateString = await fs.readFile(htmlTemplatePath, "utf-8");
  let componentsNames = await getFilesWithExt(htmlCompotentsPath, ".html");
  for (let component of componentsNames) {
    let componentString = await fs.readFile(component.filePath, "utf-8");
    let regexString = `\{\{${component.nameWtihoutExt}\}\}`;
    let regex = new RegExp(regexString, "gim");
    htmlTemplateString = htmlTemplateString.replace(regex, componentString);
  }
  await fs.writeFile(path.join(outputPath, "index.html"), htmlTemplateString);
}

async function createDist() {
  await makeFolder(projectDistPath);
  await copyFiles(assetsFolderPath, newAssetsFolderPath);
  await createBundle(styleSource, cssBundlePath);
  await buildHtmlBundle(htmlTemplatePath, htmlCompotentsPath, projectDistPath);
}

createDist();
