import commandBuilder from "../utils/createCommand";
import createEmbed from "../utils/createEmbed";

const invoke = async (ctx, requester) => {
    const responseLatency = Date.now() - ctx.createdTimestamp;
    const embed = createEmbed({
        title: "Pong!",
        requester,
        fields: [
            {
                name: "Response Latency",
                value: `${responseLatency} ms`,
                inline: true,
            },
        ],
    });
    const payload = { embeds: [embed] };
    if (ctx.isChatInputCommand) payload.ephemeral = true;
    await ctx.reply(payload);
};

const create = () => {
    const command = commandBuilder({
        name: "ping",
        description: "Check bot latency",
    });
    return command.toJSON();
};

export { create, invoke };
