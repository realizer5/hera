import commandBuilder from "../utils/createCommand";
import createEmbed from "../utils/createEmbed";
import createButton from "../utils/createButton";

const invoke = async (ctx, requester) => {
    const embed = createEmbed({
        title: "Verification Required",
        description:
            "To access This server you need to verify first \n Click on **Veify** button to start",
        requester,
    });
    const button = createButton({ customId: "send_captcha", label: "Verify" });
    const payload = { embeds: [embed], components: [button] };
    await ctx.reply(payload);
};

const create = () => {
    const command = commandBuilder({
        name: "verify",
        description: "Set channel to Verification",
    });
    return command.toJSON();
};

export { create, invoke };
