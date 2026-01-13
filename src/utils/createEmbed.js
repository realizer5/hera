import { EmbedBuilder } from "discord.js";

const createEmbed = ({
    title,
    requester,
    color = "#DC143C",
    image,
    fields = [],
}) => {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(color)
        .setImage(image)
        .addFields(fields)
        .setFooter({
            text: `Requested by ${requester.username}`,
            iconURL: requester.displayAvatarURL({ dynamic: true, size: 64 }),
        })
        .setTimestamp();
    return embed;
};

export default createEmbed;
