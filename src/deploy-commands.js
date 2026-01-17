import { REST, Routes } from "discord.js";
import { token, applicationId } from "./conf/conf";
import { Glob } from "bun";
import { join } from "path";

const __dirname = import.meta.dir; // current directory of file
const commandsDir = join(__dirname, "commands");
const commandsArray = [];
const glob = new Glob("*.js");

for await (const file of glob.scan(commandsDir)) {
    const filePath = join(commandsDir, file);
    const command = await import(filePath);
    if (!command.create || !command.invoke) {
        console.warn(`[WARN] ${file} missing create() or invoke()`);
        continue;
    }
    const commandData = command.create();
    commandsArray = commandsArray.push(commandData);
}

const rest = new REST().setToken(token);

try {
    console.log("Started refreshing application (/) commands.");
    console.log(commandsArray);

    await rest.put(Routes.applicationCommands(applicationId), {
        body: commandsArray,
    });

    console.log("Successfully reloaded application (/) commands.");
} catch (error) {
    console.error(error);
}
