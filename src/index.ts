import Proton from "./class/Proton";
import { createInterface } from "readline";
import { DEV_TARGET, IS_PRODUCTION } from "./constants";

(async () => {
  if (IS_PRODUCTION) {
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
  } else {
    console.log(`Welcome to PROTON.OSINT<DEV MODE!!> !`);
    console.log("You are in DEV mode.");
    console.log(
      `The target is: ${DEV_TARGET}. You can change it in 'src/constants/config.ts.'`
    );

    const persons = await Proton.getPerson(DEV_TARGET);

    console.log("persons:", persons);
  }
})();
