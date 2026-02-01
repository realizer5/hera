import { MessageFlags } from "discord.js";
import commandBuilder from "../utils/createCommand";

const invoke = async (ctx, _requester, args) => {
    const count = ctx.options?.getInteger("count") ?? Number(args[0]);
    const payload = {
        content: `🧹 Deleting **${count}** messages...`,
        flags: MessageFlags.Ephemeral,
    };
    if (count < 1 || count > 100 || !count) {
        payload.content = "Please provide a number between **1 and 100**";
        return await ctx.reply(payload);
    }
    try {
        if (!ctx.isChatInputCommand) await ctx.delete();
        const deleted = await ctx.channel.bulkDelete(count, true);
        payload.content = `Deleted ${deleted.size} messages`;
        if (ctx.isChatInputCommand) {
            await ctx.reply(payload);
        } else {
            const sent = await ctx.channel.send(payload.content);
            setTimeout(() => {
                sent.delete();
            }, 2000);
        }
    } catch (error) {
        console.error("Bulk delete error:", error);
        payload.content =
            "Failed to delete messages.\n" +
            "• Messages must be **under 14 days** old";
        await sent.edit(payload);
    }
};

const create = () => {
    const command = commandBuilder({
        name: "purge",
        description: "Delete messages",
    });
    command.addIntegerOption((option) =>
        option
            .setName("count")
            .setDescription("number of messages to delete")
            .setRequired(true),
    );

    return command.toJSON();
};

export { create, invoke };
