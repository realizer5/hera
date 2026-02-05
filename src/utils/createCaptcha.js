import { createCanvas } from "canvas";

const createCaptchaImage = (code, fakeCode) => {
    const canvas = createCanvas(320, 120);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1e1f22";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#4f4f55";
    ctx.font = "40px Roboto";
    for (let i = 0; i < fakeCode.length; i++) {
        const rand = Math.random() * (100 - 20) + 40;
        ctx.fillText(fakeCode[i], i * 50 + 50, rand);
    }
    ctx.fillStyle = "#DC143C";
    ctx.strokeStyle = "#DC143C";
    ctx.lineWidth = 5;
    ctx.font = "bold 48px Sans";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    for (let i = 0; i < code.length; i++) {
        const rand = Math.random() * (90 - 30) + 40;
        ctx.fillText(code[i], i * 50 + 50, rand);
        ctx.lineTo(i * 50 + 50, rand);
    }
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    return canvas.toBuffer("image/png");
};

const captchaStore = new Map();
let interval;

const createCaptcha = async (userId) => {
    const length = 5;
    const captchaExpiry = 2 * 60 * 1000; // 2 minutes
    const chars = "ABCDEFGHJKLMNPRSTUVWXYZ23456789";
    let code = "";
    let fakeCode = "";

    for (let i = 0; i < length; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
        fakeCode += chars[Math.floor(Math.random() * chars.length)];
    }

    const image = createCaptchaImage(code, fakeCode.toLowerCase());
    captchaStore.set(userId, {
        value: code,
        expires: Date.now() + captchaExpiry,
    });

    if (interval) {
        if (captchaStore.length < 2) clearInterval(interval);
    } else {
        if (captchaStore.length > 1) captchaCleanup();
    }

    return image;
};

export const verifyCaptcha = (userId, input) => {
    const data = captchaStore.get(userId);
    if (!data) return false;
    if (Date.now() > data.expires) {
        captchaStore.delete(userId);
        return false;
    }
    const valid = data.value === input.toUpperCase();
    if (valid) captchaStore.delete(userId);
    return valid;
};

const captchaCleanup = () => {
    clearInterval(interval);
    interval = setInterval(
        () => {
            const now = Date.now();
            for (const [userId, data] of captchaStore.entries()) {
                if (now > data.expires) {
                    captchaStore.delete(userId);
                }
            }
            console.log(captchaStore);
        },
        2 * 60 * 1000,
    );
};

export default createCaptcha;
