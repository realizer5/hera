import { MessageFlags } from "discord.js";
import commandBuilder from "../utils/createCommand";

const invoke = async (ctx, args) => {
    let user;
    let role;
    if (ctx.isChatInputCommand) {
        user = ctx.options.getMember("user");
        role = ctx.options.getRole("role");
    } else {
        user = ctx.mentions.members.first();
        role = ctx.mentions.roles.first();
    }
    const payload = {
        content: `**${role.name}** has been given to **${user.user.tag}**`,
        flags: MessageFlags.Ephemeral,
    };
    if (!user || !role) {
        payload.content = "User or Role not found";
        return await ctx.reply(payload);
    }
    if (user.roles.cache.has(role.id)) {
        payload.content = "User already has this role";
        return ctx.reply(payload);
    }

    await user.roles.add(role);

    return ctx.reply(payload);
};

const create = () => {
    const command = commandBuilder({
        name: "giverole",
        description: "Give a role to a user",
    });
    command
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User to give the role")
                .setRequired(true),
        )
        .addRoleOption((option) =>
            option
                .setName("role")
                .setDescription("Role to give")
                .setRequired(true),
        );
    return command.toJSON();
};

export { create, invoke };
