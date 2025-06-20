import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

// Creates an object with the data required by Discord"s API to create a SlashCommand
const create = () => {
    const command = new SlashCommandBuilder().setName("server").setDescription("Replys with some basic information about this server!");
    return command.toJSON();
};
// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = (interaction) => {
    const guild = interaction.guild;

    // Create a MessageEmbed and add an inlined field for each property displayed in the reply message
    const embed = new EmbedBuilder().setTitle(guild.name).addFields([
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
        {
            name: "Guild ID",
            value: guild.id,
            inline: true,
        },
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

    // Edit some properties of the embed to make it a bit prettier
    // Note: This could be done at the creation of the object, but I split it to make it a bit clearer
    embed
        .setColor("#DC143C")
        .setFooter({ text: "Find the source code of this bot on my GitHub!" })
        .setTimestamp()
        .setAuthor({
            name: "Developed by Realizer",
            url: "https://github.com/realizer5",
            iconURL: "https://avatars.githubusercontent.com/u/107213639?s=400&u=ec0db372e3b9e9c35f51ea391f7a23c8199b0a7d&v=4",
        })
        .setImage(guild.iconURL());

    // Reply to the user
    interaction.reply({
        embeds: [embed],
    });
};

export { create, invoke };
