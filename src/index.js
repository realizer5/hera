import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import conf from './conf/conf';
import { readdirSync } from 'fs';
import path from 'path';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent]
});

client.commands = new Collection();

const commandsDir = path.join(__dirname, "commands");
const commands = readdirSync(commandsDir).filter((file) => file.endsWith(".js"));

const commandsArray = [];

for (let command of commands) {
    const commandFile = await import(path.join(commandsDir, command));
    commandsArray.push(commandFile.create());
};

client.commands.set(commandsArray);

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const commandPath = path.join(commandsDir, interaction.commandName);
    const res = await import(commandPath);
    try {
        res.invoke(interaction);
    } catch (error) {
        console.log(error);
    }
});

client.on(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}!`);
});

const prefix = "?";

client.on("messageCreate", async (message) => {
    if (!message.content.startsWith(prefix)) return;
    const command = message.content.slice(prefix.length).split(" ")[0];
    const commandPath = path.join(commandsDir, command);
    const res = await import(commandPath);
    try {
        res.invoke(message);
    } catch (error) {
        console.log(error);
    }
});


client.login(conf.token);

// for hosting service
import express from "express";
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

