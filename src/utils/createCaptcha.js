import { createCanvas } from "canvas";

const createCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";

    for (let i = 0; i < length; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }

    return createCaptchaImage(code);
};

const createCaptchaImage = (code) => {
    const canvas = createCanvas(320, 120);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1e1f22";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 35; i++) {
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.beginPath();
        ctx.moveTo(Math.random() * 320, Math.random() * 120);
        ctx.lineTo(Math.random() * 320, Math.random() * 120);
        ctx.stroke();
    }
    ctx.font = "bold 48px Sans";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillRect(code, 160, 60);
    return canvas.toBuffer("image/png");
};

export default createCaptcha;
