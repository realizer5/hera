import { REST, Routes } from "discord.js";
import { token, applicationId } from "./conf/conf";
import path from "path";
import { readdirSync } from "fs";

const commandsDir = path.join(__dirname, "commands");
const commands = readdirSync(commandsDir).filter((file) =>
    file.endsWith(".js"),
);

const commandsArray = [];

for (let command of commands) {
    const commandFile = await import(path.join(commandsDir, command));
    commandsArray.push(commandFile.create());
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
