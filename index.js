const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");

const token = "5955122811:AAH5Cw-AZ3G6mCf1J_H_SOuGSpBwtRNd7Vw";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

// создание кнопок
// const gameOptions = {
//     reply_markup: JSON.stringify({
//         inline_keyboard: [
//             [{text:'1', callback_data: '1'}, {text:'2', callback_data: '2'},{text:'3', callback_data: '3'}],
//             [{text:'4', callback_data: '4'}, {text:'5', callback_data: '5'},{text:'6', callback_data: '6'}],
//             [{text:'7', callback_data: '7'},  {text:'8', callback_data: '8'},{text:'9', callback_data: '9'}],
//             [{text:'0', callback_data: '0'}],
//         ]
//     })
// }

// const againOptions = {
//   reply_markup: JSON.stringify({
//       inline_keyboard: [
//           [{text:'Play again', callback_data: '/again'}],
//       ]
//   })
// }

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Сейчас я загадаю цыфру`);
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Greeting" },
    { command: "/info", description: "user info" },
    { command: "/game", description: "game" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const userName = msg.chat.username;
    console.log(msg);

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/256/1.webp"
      );

      await bot.sendMessage(chatId, `hello ${userName}`);
    }

    if (text === "/info") {
      await bot.sendMessage(
        chatId,
        `your name  => ${
          msg.from.first_name && msg.from.first_name
        } your last name => ${msg.from.last_name ? msg.from.last_name : ""}`
      );
    }
    if (text === "/game") {
      startGame(chatId);
    }
  });

  bot.on("callback_query", async (msg) => {
    console.log(">>>", msg);
    const data = msg.data;
    const chatId = msg.message.chat.id;
    bot.sendMessage(chatId, `ТЫ выбрал ${data}`);
    if (data === "/again") {
      startGame(chatId);
    }
    if (data === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Ты отгадал это была цыфра ${chats[chatId]}`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `Не угадал, э то была цыфра -  ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
