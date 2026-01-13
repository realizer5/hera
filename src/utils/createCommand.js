import { SlashCommandBuilder } from "discord.js";

const commandBuilder = ({ name, description }) => {
    if (!name || !description) {
        throw new Error("Command requires name and description");
    }
    const builder = new SlashCommandBuilder()
        .setName(name)
        .setDescription(description);
    return builder;
};

export default commandBuilder;
