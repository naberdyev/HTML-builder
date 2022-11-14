const path = require("path");
const fs = require("fs/promises");
const { stdout } = process;

const secretFolderPath = path.join(__dirname, "secret-folder");

async function getFilesInfo(folder) {
  let files = await fs.readdir(folder);

  for (const file of files) {
    let filePath = path.join(folder, file);
    let stats = await fs.stat(filePath);

    if (stats.isDirectory()) continue;
    let fileExt = path.extname(filePath);
    let fileName = file.split(".")[0];
    let fileSize = stats.size;

    let statsMessage = `${fileName} - ${fileExt} - ${fileSize}b\n`;
    stdout.write(statsMessage);
  }
}

getFilesInfo(secretFolderPath);
