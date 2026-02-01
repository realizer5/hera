import createTextModal from "../utils/createTextModal";

const invoke = async (ctx) => {
    const modal = createTextModal({
        modalCustomId: "modal_captcha",
        title: "Human Verification",
        inputCustomId: "answer_captcha",
        inputLabel: "Verify Captcha",
        inputPlaceholder: "type captcha",
    });
    await ctx.showModal(modal);
};

const customId = "verify_captcha";

export { customId, invoke };
