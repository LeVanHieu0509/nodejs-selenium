import TelegramBot from "node-telegram-bot-api";
const dotenv = require("dotenv").config();

const TOKEN = process.env.TELE_BOT_TOKEN;
const TELE_BOT_GROUP_ID = process.env.TELE_BOT_GROUP_ID;

const botTele = new TelegramBot(TOKEN, { polling: true });

export async function configBot() {
  botTele.onText(/\/start/, (msg) => {
    console.log(msg.chat.id);
    botTele.sendMessage(msg.chat.id, "💲Welcome💲");
  });

  botTele.onText(/\/hieu/, (msg) => {
    botTele.sendMessage(msg.chat.id, `Anh HIẾU đẹp trai vcl ☠️☠️`);
  });
}

export function botNotiRequest(msg) {
  botTele
    .sendMessage(TELE_BOT_GROUP_ID, msg, { parse_mode: "HTML", disable_web_page_preview: true })
    .then(() => {
      console.log("you have new request");
    })
    .catch((error) => {
      console.log("fail to send tele", error);
    });
}
// Hàm lấy đoạn hội thoại trong nhóm
export async function getGroupChatHistory(limit = 10) {
  try {
    const updates = await botTele.getUpdates({
      timeout: 100,
      limit: 10,
      offset: 0,
      allowed_updates: ["message", "edited_channel_post", "callback_query"],
    });
    console.log({ updates });

    const messages = updates
      .filter((update) => update.message && update.message.chat.id.toString() === TELE_BOT_GROUP_ID)
      .map((update) => ({
        from: update.message.from.username,
        text: update.message.text,
        date: new Date(update.message.date * 1000),
      }));

    console.log("Group chat history:", messages);
    return messages;
  } catch (error) {
    console.error("Failed to get group chat history:", error);
  }
}
