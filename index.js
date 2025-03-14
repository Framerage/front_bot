import {Scenes, session, Telegraf} from "telegraf";
import {message} from "telegraf/filters";
// bot description https://core.telegram.org/bots/api
const tkn = process.env.USER_FATHER_TKN || "";
const discountBot = new Telegraf(tkn);

discountBot.use(session());

// interface IBotCommand {
//   commandName: String;
//   description: String;
//   commandCb: (ctx: any) => void;
// }
//comands
const commands = [
  {
    commandName: "start",
    description: "Запуск бота",
    commandCb: () => {},
  },
  {
    commandName: "find_discount",
    description: "Найти товар со скидкой",
    commandCb: () => {},
  },
  {
    commandName: "ref",
    description: "Получить реферальную ссылку",
    commandCb: () => {},
  },
  // {
  //   commandName: "usefull_menu",
  //   description: "Меню полезностей",
  // },
  {
    commandName: "shop_menu",
    description: "Меню магазинов",
    commandCb: () => {},
  },
];
// commands.forEach(c => {
//   discountBot.command(c.commandName, c.commandCb);
// });
// discountBot.command('start',(ctx)=>{

// })

// discountBot.on(message("text"), async (ctx) => {...}); //обработка сообщения
//bot.on(callbackQuery(), async (ctx) => {...}); //обработка нажатия на кнопку
// const { Telegraf } = require('telegraf')
// const { message } = require('telegraf/filters')

discountBot.start(ctx => ctx.reply("Welcome"));
discountBot.help(ctx => ctx.reply("Send me a sticker"));
discountBot.on(message("sticker"), ctx => ctx.reply("👍")); // обработка в
discountBot.hears(["hi", "ho", "hahaha", "go"], ctx => ctx.reply("Hey there")); //обработка ввода определенных значений
discountBot.on(message("text"), async ctx => {
  // Explicit usage
  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Hello ${ctx.state.role}`,
  );
  // Using context shortcut
  // await ctx.reply(`Hello ${ctx.state}`);
});
discountBot.launch(); //запуск бота

// Enable graceful stop
process.once("SIGINT", () => discountBot.stop("SIGINT"));
process.once("SIGTERM", () => discountBot.stop("SIGTERM"));

const mainScene = new Scenes.BaseScene("MainScene");

mainScene.enter(async ctx => {
  console.log(ctx, "bot context");
});
