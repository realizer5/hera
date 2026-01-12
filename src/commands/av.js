import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

const create = () =>
    new SlashCommandBuilder()
        .setName("av")
        .setDescription("Returns pfp of given user")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("Target user")
                .setRequired(false),
        )
        .toJSON();

const buildAvatarEmbed = (target, requester) =>
    new EmbedBuilder()
        .setTitle(target.username)
        .setColor("#DC143C")
        .setImage(target.displayAvatarURL({ dynamic: true, size: 512 }))
        .setFooter({
            text: `Requested by ${requester.username}`,
            iconURL: requester.displayAvatarURL({ dynamic: true, size: 64 }),
        });

const invoke = async (interaction) => {
    if (!interaction.isChatInputCommand) {
        return invokeMsgCommand(interaction);
    }

    const target = interaction.options.getUser("target") ?? interaction.user;

    await interaction.reply({
        embeds: [buildAvatarEmbed(target, interaction.user)],
    });
};

const invokeMsgCommand = async (message) => {
    const args = message.content.trim().split(/\s+/);
    const mentionedUser = message.mentions.users.first();
    let target = mentionedUser;

    if (!target && args[1]) {
        try {
            target = await message.client.users.fetch(args[1]);
        } catch {
            return message.reply("⚠️ Invalid user ID or mention.");
        }
    }

    target ??= message.author;

    await message.reply({ embeds: [buildAvatarEmbed(target, message.author)] });
};

export { create, invoke };
