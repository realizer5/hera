import { EmbedBuilder } from "discord.js";

const createEmbed = ({
    title,
    requester,
    color = "#DC143C",
    image,
    description = null,
}) => {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setImage(image)
        .setFooter({
            text: `Requested by ${requester?.username}`,
            iconURL: requester?.displayAvatarURL({ dynamic: true, size: 64 }),
        })
        .setTimestamp();
    return embed;
};

export default createEmbed;
