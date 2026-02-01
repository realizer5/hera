import {
    LabelBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";

const createTextModal = ({
    modalCustomId,
    title,
    inputCustomId,
    inputStyle = TextInputStyle.Short,
    inputLabel,
    inputPlaceholder,
}) => {
    const modal = new ModalBuilder().setCustomId(modalCustomId).setTitle(title);
    const input = new TextInputBuilder()
        .setCustomId(inputCustomId)
        .setStyle(inputStyle)
        .setPlaceholder(inputPlaceholder);
    const labeledInput = new LabelBuilder()
        .setLabel(inputLabel)
        .setTextInputComponent(input);
    modal.addLabelComponents(labeledInput);
    return modal;
};

export default createTextModal;
