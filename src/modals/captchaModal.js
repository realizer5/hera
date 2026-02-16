import { MessageFlags } from "discord.js";
import { verifyCaptcha } from "../utils/createCaptcha";
import { roleId } from "../conf/conf";

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
    const role = ctx.guild.roles.cache.get(roleId);
    if (!role) return;
    const user = await ctx.guild.members.fetch(ctx.user.id);
    await user.roles.add(role);
    await ctx.reply(payload);
};

const customId = "modal_captcha";

export { customId, invoke };
