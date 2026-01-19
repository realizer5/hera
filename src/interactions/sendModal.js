import {
    LabelBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";

const sendModal = async (ctx) => {
    const modal = new ModalBuilder()
        .setCustomId("captcha_modal")
        .setTitle("Human Verification");
    const input = new TextInputBuilder()
        .setCustomId("captcha_answer")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("type captcha");
    const inputLabel = new LabelBuilder()
        .setLabel("Verify Captcha")
        .setTextInputComponent(input);
    modal.addLabelComponents(inputLabel);
    await ctx.showModal(modal);
};

export default sendModal;
