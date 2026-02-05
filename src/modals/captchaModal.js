import { MessageFlags } from "discord.js";
import { verifyCaptcha } from "../utils/createCaptcha";

const invoke = async (ctx) => {
    const answer = ctx.fields.getTextInputValue("answer_captcha");
    const payload = {
        content: "You are verified",
        flags: MessageFlags.Ephemeral,
    };
    const verify = verifyCaptcha(ctx.user.id, answer);
    if (!verify) {
        payload.content = "Incorrect captcha";
        await ctx.reply(payload);
        return;
    }
    await ctx.reply(payload);
};

const customId = "modal_captcha";

export { customId, invoke };
