const path = require("path");
const fs = require("fs");

const secretFolderPath = path.join(__dirname, "secret-folder");

fs.readdir(secretFolderPath, (error, files) => {
  if (error) console.error(error.message);
  else {
    files.forEach((file) => {
      let fileData = path.parse(path.join(secretFolderPath, `${file}`));
      fs.stat(path.join(fileData.dir, fileData.base), (error, stats) => {
        if (error) console.error(error.message);
        if (stats.isFile()) {
          console.log(
            `${fileData.name} - ${fileData.ext.split(".")[1]} - ${stats.size}b`
          );
        }
      });
    });
  }
});
