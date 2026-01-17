import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { join } from "node:path";
import { token, prefix, ownerId, roleId } from "./conf/conf";
import { Glob } from "bun";

const __dirname = import.meta.dir; // current directory of file

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

const commandsDir = join(__dirname, "commands");

const glob = new Glob("*.js");

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

client.on(Events.InteractionCreate, async (ctx) => {
    if (!ctx.isChatInputCommand()) return;
    const command = client.commands.get(ctx.commandName);
    if (!command) return;
    if (ctx.user.id !== ownerId) {
        await ctx.reply("You are not **Cool** enough to do this");
        return;
    }
    try {
        await command.invoke(ctx, ctx.user);
    } catch (error) {
        console.error(error);
        if (!ctx.replied && !ctx.deferred) {
            await ctx.reply({
                content: "Error executing command",
                ephemeral: true,
            });
        }
    }
});

client.on(Events.MessageCreate, async (ctx) => {
    if (ctx.author.bot) return;
    if (!ctx.content.startsWith(prefix)) return;
    const args = ctx.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;
    if (ctx.author.id !== ownerId) {
        await ctx.reply("You are not **Cool** enough to do this");
        return;
    }
    const command = client.commands.get(commandName);
    if (!command) return;
    try {
        await command.invoke(ctx, ctx.author, args);
    } catch (error) {
        console.error(error);
        await ctx.reply("Error executing command");
    }
});

client.on("guildMemberAdd", async (ctx) => {
    try {
        const role = ctx.guild.roles.cache.get(roleId);
        if (!role) return;
        await ctx.roles.add(role);
    } catch (error) {
        console.error("Error assigning entry role: ", error);
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
