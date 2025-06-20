import { MessageFlags, SlashCommandBuilder } from "discord.js";

const create = () => {
    const command = new SlashCommandBuilder().setName("ping").setDescription("Reply with Pong!");
    return command.toJSON();
};

const invoke = (interaction) => {
    interaction.reply({ content: "Pong!", flags: MessageFlags.Ephemeral });
};

export { create, invoke };
