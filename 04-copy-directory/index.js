const fs = require("fs/promises");
const path = require("path");

const folderName = "files";
const folderPath = path.join(__dirname, folderName);
const newFolderPath = path.join(__dirname, folderName + "-copy");

async function makeFolder(newFolderPath) {
  await fs.rm(newFolderPath, { force: true, recursive: true });
  await fs.mkdir(newFolderPath, { recursive: true });
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
  console.log(`Folder\n ${src}\nwas copied to\n ${dest}`);
}

copyFiles(folderPath, newFolderPath);
