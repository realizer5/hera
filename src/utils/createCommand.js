import { SlashCommandBuilder } from "discord.js";

const commandBuilder = ({ name, description, options = [] }) => {
    if (!name || !description) {
        throw new Error(
            "Command requires name, description, and invoke function",
        );
    }
    const builder = new SlashCommandBuilder()
        .setName(name)
        .setDescription(description);
    for (const option of options) {
        option(builder);
    }
    const create = () => builder.toJSON();
    return create;
};

export default commandBuilder;
