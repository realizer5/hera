import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

const create = () => {
    const command = new SlashCommandBuilder().setName("pfp").setDescription("Returns Pfp of given User")
        .addUserOption(option => option.setName("target").setDescription("Target user to get pfp").setRequired(false));
    return command.toJSON();
};

const invoke = (interaction) => {
    const user = interaction.options.getUser("target") || interaction.user;
    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 512 });
    const embed = new EmbedBuilder().setTitle(user.username);
    embed
        .setColor("#DC143C")
        .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 64 })
        })
        .setImage(avatarURL);
    interaction.reply({
        embeds: [embed],
    });
};


export { create, invoke };
