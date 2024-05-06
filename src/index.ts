import Proton from "./class/Proton";
import readline from "readline"; // Import the 'readline' module
import { createInterface } from "readline"; // Import the 'createInterface' function

// 1) ASCII art PROTON.OSINT
// 2) Ask the user for a name to osint
// 3) Get the persons
// 4) Print the persons

(async () => {
  console.log(`
  ██████╗ ██████╗  ██████╗ ████████╗ ██████╗ ███╗   ██╗
  ██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝██╔═══██╗████╗  ██║
  ██████╔╝██████╔╝██║   ██║   ██║   ██║   ██║██╔██╗ ██║
  ██╔═══╝ ██╔══██╗██║   ██║   ██║   ██║   ██║██║╚██╗██║
  ██║     ██║  ██║╚██████╔╝   ██║   ╚██████╔╝██║ ╚████║
  ╚═╝     ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝ ╚═╝  ╚═══╝
  `);
  console.log("Welcome to PROTON.OSINT!");

  // 2) Ask the user for a name to osint
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const targetName = await new Promise<string>((resolve) => {
    rl.question("Enter the name you want to osint: ", (answer) => {
      resolve(answer);
    });
  });

  // 3) Get the persons
  const persons = await Proton.getPerson(targetName);

  // 4) Print the persons
  console.table(persons);

  rl.close();
})();
