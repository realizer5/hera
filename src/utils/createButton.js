import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

const createButton = ({ customId, label, style = ButtonStyle.Success }) => {
    const button = new ButtonBuilder()
        .setCustomId(customId)
        .setLabel(label)
        .setStyle(style);
    const row = new ActionRowBuilder().addComponents(button);
    return row;
};

export default createButton;
