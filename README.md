# Hera - Discord Administration Bot
Hera is a powerful and customizable Discord administration bot built with JavaScript.
It helps server owners and moderators manage roles, users, and server activity efficiently.

## ✨ Features

- 👥 User & Role Management
  - Add / remove roles
  - Manage user permissions
  - Bulk role handling

- 🛠️ Moderation Tools
  - Kick / Ban users
  - Timeout / Mute system
  - Clear messages

- 📋 Interactive UI
  - Select menus for role management
  - Buttons & embeds for better UX

- ⚙️ Custom Commands
  - Extendable command system
  - Easy to add new features

- 🔐 Verification System
 - CAPTCHA-based verification
 - Helps prevent bots and spam accounts
 - Easy setup with a single command

- ⚡ High Performance
 - Built using Bun-exclusive features
 - Faster startup and execution compared to traditional Node.js bots

---

## 🚀 Tech Stack

- **Bun**
- **discord.js**
- JavaScript (ES6+)

---

## 📦 Installation

> ⚠️ Requires Bun installed

```bash
git clone https://github.com/your-username/hera.git
cd hera
bun install
```

### Setup
1. Create a bot via the Discord Developer Portal
2. Copy your bot token
3. Configure environment variables:

```bash
cp .env.example .env
```

fill in your `.env`

#### Scripts
Hera uses Bun scripts for different environments:
```bash
bun run dev # Run in development mode (auto reload)
bun run start # RUn in production
bun run dep # Register slash commands
```
>Make sure to run `bun run dep` whenever you update or add commands.

## Project Structure

```
hera/
│── fonts/                # Custom fonts used (e.g., for CAPTCHA images)
│   └── <font-files>

│── src/
│   │── buttons/          # Button interaction handlers
│   │── commands/         # Slash commands
│   │── conf/             # Environment & configuration loader
│   │── modals/           # Modal interaction handlers
│   │── utils/            # Helper functions & command builders
│   │── index.js          # Main bot entry (client events, handlers)
│   │── deploy-commands.js # Slash command registration logic
```
