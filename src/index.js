import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import conf from './conf/conf';
import { readdirSync } from 'fs';
import path from 'path';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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
    res.invoke(interaction);
});

client.on(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}!`);
});


client.login(conf.token);
