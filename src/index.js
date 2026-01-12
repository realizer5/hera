import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { join } from "node:path";
import { token, prefix } from "./conf/conf";

const __dirname = import.meta.dir; // current directory of file

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

const commandsDir = join(__dirname, "commands");

const glob = new Bun.Glob("*.js");

for await (const file of glob.scan(commandsDir)) {
    const filePath = join(commandsDir, file);
    const command = await import(filePath);
    if (!command.create || !command.invoke) {
        console.warn(`[WARN] ${file} missing create() or invoke()`);
        continue;
    }
    const commandData = command.create();
    client.commands.set(commandData.name, command);
}

console.log(`Loaded ${client.commands.size} commands`);

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.invoke(interaction);
    } catch (error) {
        console.error(error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: "Error executing command",
                ephemeral: true,
            });
        }
    }
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;
    const command = client.commands.get(commandName);
    if (!command) return;
    try {
        await command.invoke(message);
    } catch (error) {
        console.error(error);
        await message.reply("Error executing command");
    }
});

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag}`);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection: ", err);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exeception: ", err);
});

client.login(token);
