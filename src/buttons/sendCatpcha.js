import { MessageFlags } from "discord.js";
import createButton from "../utils/createButton";
import createCaptcha from "../utils/createCaptcha";
import createEmbed from "../utils/createEmbed";

const invoke = async (ctx) => {
    const image = await createCaptcha(ctx.user.id);
    const embed = createEmbed({
        title: "Are you Human?",
        description: "**Please type the Captcha below**",
        image: "attachment://captcha.png",
    });
    embed.addFields({
        name: "Guide",
        value: `Type traced characters from left to right \n
        Ignore the decoy characters with grey color \n
        You don't have to respect character cases (uppercase/lowercase)`,
    });
    embed.setFooter({ text: "Captcha valid for 2 minutes" });
    const button = createButton({
        customId: "verify_captcha",
        label: "Answer",
    });
    const payload = {
        embeds: [embed],
        files: [{ attachment: image, name: "captcha.png" }],
        components: [button],
        flags: MessageFlags.Ephemeral,
    };
    await ctx.reply(payload);
};

const customId = "send_captcha";

export { customId, invoke };
