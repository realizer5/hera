import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

const create = () => {
    const command = new SlashCommandBuilder().setName("av").setDescription("Returns pfp of given User")
        .addUserOption(option => option.setName("target").setDescription("Target user to get pfp").setRequired(false));
    return command.toJSON();
};

const invoke = (interaction) => {
    const isInteraction = interaction.isChatInputCommand;
    const target = isInteraction ? interaction.options.getUser("target") || interaction.user
        : interaction.mentions.users.first() || interaction.author;
    const user = isInteraction ? interaction.user : interaction.author;
    const avatarURL = target.displayAvatarURL({ dynamic: true, size: 512 });
    const embed = new EmbedBuilder().setTitle(target.username);
    embed
        .setColor("#DC143C")
        .setFooter({
            text: `Requested by ${user.username}`,
            iconURL: user.displayAvatarURL({ dynamic: true, size: 64 })
        })
        .setImage(avatarURL);
    interaction.reply({
        embeds: [embed],
    });
};

export { create, invoke };
