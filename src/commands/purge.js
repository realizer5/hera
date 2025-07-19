import { Collection, EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";

const create = () => {
    const command = new SlashCommandBuilder().setName("purge").setDescription("deletes messages from channel")
        .addIntegerOption(option => option.setName("count").setDescription("number of messages to delete").setRequired(true));
    return command.toJSON();
};

const invoke = async (interaction) => {
    if (interaction.isChatInputCommand) {
        const count = interaction.options.getInteger("count");
        if (count < 1 || count > 100) {
            return interaction.reply("Please provide a valid count between 1 and 100");
        }
        await interaction.reply({ content: `Deleting ${count} messages...`, flags: MessageFlags.Ephemeral });
        try {
            const deleted = await interaction.channel.bulkDelete(count, true);
            const userMsgCount = new Collection();
            deleted.forEach((msg) => {
                const username = msg.author.username;
                userMsgCount.set(username, (userMsgCount.get(username) || 0) + 1);
            });
            const embed = new EmbedBuilder().setTitle(`✔ deleted ${deleted.size} messages`)
            embed.setColor("#DC143C");
            let description = "";
            userMsgCount.forEach((count, username) => {
                description += `**${username}**: ${count} messages\n`;
            });
            await interaction.editReply({ embeds: [embed] });
            embed.setDescription(description);
        } catch (error) {
            console.error("Bulk delete error:", error);
            await interaction.editReply("❌ Failed to delete messages. Make sure the messages are not older than 14 days and that I have the proper permissions.");
        }
    } else {
        invokeMsgCommand(interaction);
    }
};

const invokeMsgCommand = async (message) => {
    const count = Number(message.content.split(" ")[1]);
    if (count < 1 || count > 100) {
        return message.reply("Please provide a valid count between 1 and 100");
    }
    try {
        await message.reply(`Deleting ${count} messages..`);
        const deleted = await message.channel.bulkDelete(count + 2);
        const userMsgCount = new Collection();
        let i = 0;
        deleted.forEach((msg) => {
            if (i < 2) {
                i++;
                return;
            }
            const username = msg.author.username;
            userMsgCount.set(username, (userMsgCount.get(username) || 0) + 1);
        });

        const embed = new EmbedBuilder().setTitle(`✔ deleted ${deleted.size - 2} messages`)
        embed.setColor("#DC143C");
        let description = "";
        userMsgCount.forEach((count, username) => {
            description += `**${username}**: ${count} messages\n`;
        });

        embed.setDescription(description);

        const sentMessage = await message.channel.send({ embeds: [embed] });

        setTimeout(() => {
            sentMessage.delete();
        }, 2000);
    } catch (error) {
        console.error("Bulk delete error:", error);
        message.reply("❌ Failed to delete messages. Make sure the messages are not older than 14 days and that I have the proper permissions.");
    }
}

export { create, invoke }
