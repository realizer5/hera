import commandBuilder from "../utils/createCommand";
import createEmbed from "../utils/createEmbed";

const invoke = async (ctx, requester) => {
    const guild = ctx.guild;
    const embed = createEmbed({
        title: guild.name,
        image: guild.iconURL(),
        requester,
    });
    embed.addFields([
        {
            name: "Membercount",
            value: guild.memberCount.toString(),
            inline: true,
        },
        {
            name: "Created At",
            value: guild.createdAt.toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }),
            inline: true,
        },
        { name: "Guild ID", value: guild.id, inline: true },
        {
            name: "Voice AFK Channel",
            value: guild.afkChannel?.name ?? "None",
            inline: true,
        },
        {
            name: "Voice AFK Timeout",
            // Timeout formatted as MM:SS
            value: `${(guild.afkTimeout / 60).toString().padStart(2, "0")}:${(
                guild.afkTimeout % 60
            )
                .toString()
                .padStart(2, "0")}`, // You could implement a check whether the channel is even active
            inline: true,
        },
        {
            name: "Custom URL",
            value: guild.vanityURLCode ?? "None",
            inline: true,
        },
        {
            name: "Boosts",
            value: guild.premiumSubscriptionCount.toString(),
            inline: true,
        },
        {
            name: "Discord Partner Server",
            value: guild.partnered ? "Yes" : "No",
            inline: true,
        },
        {
            name: "Verified Server",
            value: guild.verified ? "Yes" : "No",
            inline: true,
        },
    ]);

    const payload = { embeds: [embed] };
    await ctx.reply(payload);
};

const create = () => {
    const command = commandBuilder({
        name: "server",
        description: "Display server information",
    });
    return command.toJSON();
};

export { create, invoke };
