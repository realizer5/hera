import { MessageFlags } from "discord.js";

const invoke = async (ctx) => {
    const answer = ctx.fields.getTextInputValue("answer_captcha");
    const payload = {
        content: "You are verified",
        flags: MessageFlags.Ephemeral,
    };
    if (answer !== "abcde") {
        payload.content = "Incorrect captcha";
        await ctx.reply(payload);
        return;
    }
    await ctx.reply(payload);
};

const customId = "modal_captcha";

export { customId, invoke };
