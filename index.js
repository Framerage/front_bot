import TelegramBot from "node-telegram-bot-api";
// bot description https://core.telegram.org/bots/api

const shopBot = new TelegramBot(process.env.USER_FATHER_TKN, {
  polling: {
    interval: 300,
    autoStart: true,
  },
});

const commands = [
  {
    command: "start",
    description: "Запуск бота",
  },
  {
    command: "ref",
    description: "Получить реферальную ссылку",
  },
  {
    command: "usefull_menu",
    description: "Меню полезностей",
  },
  {
    command: "role_menu",
    description: "Ролевое меню",
  },
];

shopBot.setMyCommands(commands);
let userRole = "";
let locationLatitude = null;
let locationLongitude = null;
const COORD_REGEXP = /(\d+\.\d+)/;
const USEFULL_MENU = [
  ["Локация по координатам"],
  [{text: "Координаты геолокации", request_location: true}],
  ["❌ Закрыть меню"],
];
const ROLE_MENU = [
  [
    {text: "Frontend-React", callback_data: "sticker"},
    {text: "Frontend-Vue", callback_data: "circleVideo"},
  ],
  [{text: "Fullstack", callback_data: "checkSubs"}],
  [{text: "Закрыть Меню", callback_data: "closeMenu"}],
];
shopBot.on("message", async msg => {
  if (msg.text?.startsWith("/start")) {
    await shopBot.sendMessage(msg.chat.id, "Ну привет, " + msg.from.username);
    await shopBot.sendMessage(msg.chat.id, `Кто такой будешь?`, {
      reply_markup: {
        inline_keyboard: ROLE_MENU,
      },
    });
  }

  if (msg.text === "/usefull_menu") {
    await shopBot.sendMessage(msg.chat.id, `Меню полезностей`, {
      reply_markup: {
        keyboard: USEFULL_MENU,
      },
      resize_keyboard: true,
    });
  }
  if (msg.text === "Локация по координатам") {
    if (!locationLatitude) {
      await shopBot.sendMessage(msg.chat.id, "Введите широту (Широта:55.8835)");
      return;
    }
    if (!locationLongitude) {
      await shopBot.sendMessage(
        msg.chat.id,
        "Введите долготу (Долгота:44.22234)",
      );
      return;
    }
    await shopBot.sendLocation(
      msg.chat.id,
      locationLatitude,
      locationLongitude,
      {
        reply_to_message_id: `Широта: ${locationLatitude}\nДолгота: ${locationLongitude}`,
      },
    );
    locationLatitude = null;
    locationLongitude = null;
  }
  //TODO: кнопка/команда сброса локации
  if (msg.text.startsWith("Широта:")) {
    locationLatitude = msg.text.slice(7).trim();
    if (!COORD_REGEXP.test(locationLatitude)) {
      await shopBot.sendMessage(
        msg.chat.id,
        "Неверный формат. Введите широту (Широта:55.8835)",
      );
      return;
    }
    if (!locationLongitude) {
      await shopBot.sendMessage(
        msg.chat.id,
        "Введите долготу (Долгота:44.23452)",
      );
      return;
    }
    await shopBot.sendLocation(
      msg.chat.id,
      locationLatitude,
      locationLongitude,
      {
        protect_content: true,
      },
    );
    locationLatitude = null;
    locationLongitude = null;
  }
  if (msg.text.startsWith("Долгота:")) {
    locationLongitude = msg.text.slice(8).trim();
    if (!COORD_REGEXP.test(locationLongitude)) {
      await shopBot.sendMessage(
        msg.chat.id,
        "Неверный формат. Введите долготу (Долгота:55.8835)",
      );
      return;
    }
    if (!locationLatitude) {
      await shopBot.sendMessage(
        msg.chat.id,
        "Введите широту (Широта:33.656335)",
      );
      return;
    }
    await shopBot.sendLocation(
      msg.chat.id,
      locationLatitude,
      locationLongitude,
      {
        protect_content: true,
      },
    );
    locationLatitude = null;
    locationLongitude = null;
  }
  console.log(locationLatitude, "locationLatitude");
  console.log(locationLongitude, "locationLongitude");
  if (msg.text === "❌ Закрыть меню") {
    await shopBot.sendMessage(msg.chat.id, "Close menu", {
      reply_markup: {
        remove_keyboard: true,
      },
    });
  }
  if (msg.text === "/role_menu") {
    await shopBot.sendMessage(msg.chat.id, `Кто такой будешь?`, {
      reply_markup: {
        inline_keyboard: ROLE_MENU,
      },
    });
  }
});

shopBot.on("location", async location => {
  try {
    await shopBot.sendMessage(
      location.chat.id,
      `Широта: ${location.location.latitude}\nДолгота: ${location.location.longitude}`,
    );
  } catch (error) {
    console.log(error);
  }
});
shopBot.on("callback_query", async ctx => {
  try {
    switch (ctx.data) {
      case "closeMenu":
        await shopBot.deleteMessage(
          ctx.message.chat.id,
          ctx.message.message_id,
        );
        break;
    }
  } catch (error) {
    console.log(error);
  }
});
// shopBot.on('text', async msg => {
//     if(msg.text.startsWith('/start')){
//         await shopBot.sendMessage(msg.chat.id, `Дарова`)
//         if(msg.text.length > 6) {

//             const refID = msg.text.slice(7);

//             await shopBot.sendMessage(msg.chat.id, `Вы зашли по ссылке пользователя с ID ${refID}`);

//         }
//         // return
//     }
//     if(msg.text == '/ref') {
//         await shopBot.sendMessage(msg.chat.id, `${botUrl}?start=${msg.from.id}`);
//         // return
//     }
//     if(msg.text == '/help') {
//         await shopBot.sendMessage(msg.chat.id, `Раздел помощи HTML\n\n<b>Жирный Текст</b>\n<i>Текст Курсивом</i>\n<code>Текст с Копированием</code>\n<s>Перечеркнутый текст</s>\n<u>Подчеркнутый текст</u>\n<pre language='c++'>код на c++</pre>\n<a href='t.me'>Гиперссылка</a>`, {

//             parse_mode: "HTML"

//         });
//         // return
//     }
// })
// if(msg.text == '/menu') {

//     await shopBot.sendMessage(msg.chat.id, `Меню бота`, {

//         reply_markup: {

//             keyboard: [

//                 ['⭐️ Картинка', '⭐️ Видео'],
//                 ['⭐️ Аудио', '⭐️ Голосовое сообщение'],
//                 ['❌ Закрыть меню']

//             ]

//         },
//         resize_keyboard: true

//     })
// // return
// }
//     if(msg.text ==='❌ Закрыть меню'){

//         await shopBot.sendMessage(msg.chat.id,'',{

//             reply_markup: {

//             remove_keyboard: true
//         }
//     })
// }

// await shopBot.sendMessage(msg.chat.id, msg.text);

//delete msg and send new
// setTimeout(async () => {

//     await shopBot.deleteMessage(msgWait.chat.id, msgWait.message_id);
//     await shopBot.sendMessage(msg.chat.id, msg.text);

// }, 5000);

//edit msg
// setTimeout(async () => {

//     await bot.editMessageText(msg.text, {

//         chat_id: msgWait.chat.id,
//         message_id: msgWait.message_id

//     });

// }, 5000);

// })
// shopBot.on("polling_error", err => console.log(err.data.error.message));
