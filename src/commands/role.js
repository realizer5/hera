import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import commandBuilder from "../utils/createCommand";
import createEmbed from "../utils/createEmbed";

const invoke = async (ctx, requester, args) => {
    const user =
        ctx.mentions.members.first() ??
        (await ctx.guild.members.fetch(args[0]));

    const embed = createEmbed({
        title: `Manage Roles for ${user.user.username}`,
        description: `Manage Roles by selecting or removing selection`,
        image: user.displayAvatarURL({ dynamic: true, size: 128 }),
        requester,
    });

    const roles = ctx.guild.roles.cache
        .filter((role) => role.name !== "@everyone")
        .first(5); // max 25 options

    const menu = new StringSelectMenuBuilder()
        .setCustomId(`role_select:${user.id}`)
        .setPlaceholder("Select your roles")
        .setMaxValues(5)
        .addOptions(
            roles.map((role) => ({
                label: role.name,
                value: role.id,
                default: user.roles.cache.has(role.id),
            })),
        );

    const row = new ActionRowBuilder().addComponents(menu);

    await ctx.reply({ embeds: [embed], components: [row] });
};

const create = () => {
    const command = commandBuilder({
        name: "manage",
        description: "manage roles of a user",
    });
    command.addUserOption((option) =>
        option
            .setName("user")
            .setDescription("user to manage roles")
            .setRequired(true),
    );
    return command.toJSON();
};

export { create, invoke };
