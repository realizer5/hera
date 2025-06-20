import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

const create = () => {
    const command = new SlashCommandBuilder().setName("av").setDescription("Returns pfp of given User")
        .addUserOption(option => option.setName("target").setDescription("Target user to get pfp").setRequired(false));
    return command.toJSON();
};


const invoke = (interaction) => {
    if (interaction.isChatInputCommand) {
        const target = interaction.options.getUser("target") || interaction.user;
        const avatarURL = target.displayAvatarURL({ dynamic: true, size: 512 });
        const embed = new EmbedBuilder().setTitle(target.username);
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
    } else { invokeMsgCommand(interaction) }
};

const invokeMsgCommand = async (message) => {
    let userId = message.content.split(" ")[1];
    let target = null;
    try {
        target = await message.client.users.fetch(userId);
    } catch (error) {
        if (userId) return message.reply('⚠️ This is not a valid user ID format.');
        target = message.mentions.users.first() || message.author;
    }
    const user = message.author;
    const avatarURL = target.displayAvatarURL({ dynamic: true, size: 512 });
    const embed = new EmbedBuilder().setTitle(target.username);
    embed
        .setColor("#DC143C")
        .setFooter({
            text: `Requested by ${user.username}`,
            iconURL: user.displayAvatarURL({ dynamic: true, size: 64 })
        })
        .setImage(avatarURL);
    message.reply({
        embeds: [embed],
    });
};

export { create, invoke };
