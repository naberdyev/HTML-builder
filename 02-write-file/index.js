const readline = require("readline");
const { stdin, stdout } = process;
const path = require("path");
const fs = require("fs");

const writeToFile = fs.createWriteStream(path.join(__dirname, "text.txt"), {
  flags: process.argv[2] === "-a" ? "a" : "w",
});
const rl = readline.createInterface({ input: stdin, output: stdout });

const stop = () => {
  stdout.write("Good bye!");
  rl.close();
  writeToFile.close();
};
const write = (input) => {
  if (input.toLowerCase() === "exit") stop();
  else writeToFile.write(`${input}\n`);
};

// writing question and handling first line
rl.question("Type something here to write it in the text file: ", (input) => {
  write(input);
});

rl.on("line", write);

rl.on("SIGINT", () => {
  stop();
});
