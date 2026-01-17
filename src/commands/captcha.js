import commandBuilder from "../utils/createCommand";
import createEmbed from "../utils/createEmbed";

const invoke = async (ctx, requester, args) => {
    let user;
    if (ctx.isChatInputCommand) {
        user = ctx.options.getUser("user");
    } else {
        user = ctx.mentions.users.first();
        if (!user && args[0]) {
            user = await ctx.client.users.fetch(args[0]);
        }
    }
    if (!user) user = requester;
    const embed = createEmbed({
        title: user.username,
        image: user.displayAvatarURL({ dynamic: true, size: 512 }),
        requester,
    });
    const payload = { embeds: [embed] };
    await ctx.reply(payload);
};

const create = () => {
    const command = commandBuilder({
        name: "captcha",
        description: "Generate a Captcha",
    });
    return command.toJSON();
};

export { create, invoke };
