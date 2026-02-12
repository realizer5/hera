import {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    MessageFlags,
} from "discord.js";
import { join } from "node:path";
import { token, prefix, ownerId, roleId, ownerGfId } from "./conf/conf";
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
client.buttons = new Collection();
client.modals = new Collection();

const commandsDir = join(__dirname, "commands");
const buttonsDir = join(__dirname, "buttons");
const modalsDir = join(__dirname, "modals");

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

for await (const file of glob.scan(buttonsDir)) {
    const filePath = join(buttonsDir, file);
    const button = await import(filePath);
    if (!button.customId || !button.invoke) {
        console.warn(`[WARN] ${file} missing customId or invoke()`);
        continue;
    }
    client.buttons.set(button.customId, button.invoke);
}

for await (const file of glob.scan(modalsDir)) {
    const filePath = join(modalsDir, file);
    const modal = await import(filePath);
    if (!modal.customId || !modal.invoke) {
        console.warn(`[WARN] ${file} missing customId or invoke()`);
        continue;
    }
    client.modals.set(modal.customId, modal.invoke);
}

console.log(
    `Loaded ${client.commands.size} commands, ${client.buttons.size} buttons, ${client.modals.size} modals`,
);

client.on(Events.InteractionCreate, async (ctx) => {
    try {
        if (ctx.isButton()) {
            const button = client.buttons.get(ctx.customId);
            if (!button) return;
            await button(ctx);
            return;
        }
        if (ctx.isModalSubmit()) {
            const modal = client.modals.get(ctx.customId);
            if (!modal) return;
            await modal(ctx);
            return;
        }
        if (!ctx.isChatInputCommand()) return;
        const command = client.commands.get(ctx.commandName);
        if (!command) return;
        if (ctx.author.id !== ownerId && ctx.author.id !== ownerGfId) {
            await ctx.reply("You are not **Cool** enough to do this");
            return;
        }
        await command.invoke(ctx, ctx.user);
    } catch (error) {
        console.error(error);
        if (!ctx.replied && !ctx.deferred) {
            await ctx.reply({
                content: "Error executing command",
                flags: MessageFlags.Ephemeral,
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
    const command = client.commands.get(commandName);
    if (!command) return;
    if (ctx.author.id !== ownerId && ctx.author.id !== ownerGfId) {
        await ctx.reply("You are not **Cool** enough to do this");
        return;
    }
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
