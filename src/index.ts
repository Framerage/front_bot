import {Markup, Telegraf} from "telegraf";
import {message} from "telegraf/filters";

const tkn = process.env.USER_FATHER_TKN || "";
const helpDescription = process.env.BOT_HELP || "test";

const luckyBot = new Telegraf(tkn);

// discountBot.start(ctx => ctx.reply("Very welcome"));
// discountBot.on(message("animation"), ctx => ctx.reply("👍"));
// discountBot.on(message("sticker"), ctx => ctx.reply("👍"));
// discountBot.on(message("contact"), ctx => ctx.reply("👍"));
// discountBot.on(message("photo"), ctx => ctx.reply("I can't read it"));
// discountBot.on(message("voice"), ctx => ctx.reply("I can't hear it"));

// //добавить библу на матные слова
// discountBot.hears(["hi", "ho", "hahaha", "go"], ctx => ctx.reply("Hey there"));

//обработка вводимого продукта
// type TShops = "x5Res" | "magnitRes" | "guliverRes";
// interface ISearchDiscountResult {}
// discountBot.on(message("text"), async ctx => {
//   console.log(ctx, " context current");
//   await ctx.telegram.sendMessage(ctx.message.chat.id, `Ща поищем...`);
//   //   try {
//   //     const [x5Res, magnitRes, guliverRes] = await Promise.allSettled([
//   //       apiRequest<any>(x5Api,{params:{
//   //         mode:'delivery',
//   //         limit:100,
//   //         q:
//   //       }}),
//   //       apiRequest<any>("/api/v1/calculations_lvl2"),
//   //       apiRequest<any>("/api/v1/calculations_lvl3"),
//   //     ]);
//   //     console.log(x5Res, "x5Res");
//   //   } catch (error) {
//   //     throw new Error(`Error with search discount - ${error}`);
//   //   }
// });

// const randonNumScene = new WizardScene(
//   "randomNum",
//   ctx => {
//     let keyboard_buttons = Markup.keyboard(["Я водитель"]).oneTime().resize();
//     ctx.reply("Кто вы?", keyboard_buttons);
//     return ctx.wizard.next();
//   },
//   ctx => {
//     ctx.reply(`Я грут`);
//     return ctx.wizard.next();
//   },
// );
// const stages= new Stage([randonNumScene])
const gamesKeyboard = [
  [
    {
      text: "Number",
      callback_data: "randomNumber",
    },
    {text: "Dice", callback_data: "diceGame"},
  ],
  [
    {
      text: "Close",
      callback_data: "closeKeyboard",
    },
  ],
];
let currentRandomNumber: number | null = null;
luckyBot.start(ctx => {
  ctx.reply("Well, let`s play", Markup.inlineKeyboard(gamesKeyboard));
});
luckyBot.help(ctx => ctx.reply(helpDescription));

luckyBot.command("games", ctx => {
  ctx.reply("Games", Markup.inlineKeyboard(gamesKeyboard));
});
luckyBot.command("show_number", ctx => {
  ctx.reply(
    currentRandomNumber
      ? `Загаданное число ${currentRandomNumber}`
      : "Не покажу",
  );
});

luckyBot.action("randomNumber", ctx => {
  currentRandomNumber = Math.floor(Math.random() * 10);
  ctx.reply(`Случайно число загадано`);
  ctx.editMessageReplyMarkup({inline_keyboard: []});
});

luckyBot.action("diceGame", ctx => {
  ctx.replyWithDice();
  ctx.editMessageReplyMarkup({inline_keyboard: []});
});

luckyBot.action("closeKeyboard", ctx => {
  ctx.editMessageReplyMarkup({inline_keyboard: []});
});

luckyBot.hears(["Покажи число", "покажи число"], ctx => {
  ctx.reply(
    currentRandomNumber
      ? `Загаданное число ${currentRandomNumber}`
      : "Не покажу",
  );
});

luckyBot.on(message("text"), ctx => {
  if (ctx.update.message.text == String(currentRandomNumber)) {
    console.log("test", currentRandomNumber);
    ctx.reply(
      `@${ctx.update.message.from.username} угадал(а). Число ${currentRandomNumber}`,
    );
    currentRandomNumber = null;
  }
});

luckyBot.launch();
process.once("SIGINT", () => luckyBot.stop("SIGINT"));
process.once("SIGTERM", () => luckyBot.stop("SIGTERM"));
