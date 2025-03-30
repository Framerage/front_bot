import {nextTick} from "process";
import {Context, Markup, Telegraf} from "telegraf";
import {message} from "telegraf/filters";

const tkn = process.env.USER_FATHER_TKN || "";
const helpDescription = process.env.BOT_HELP || "";
const x5Api = process.env.X5_SEARCH_API || "";

// const fetchProd = await fetch("?mode=delivery&q=чипсыtwisterlimit=100")
//   .then(res => res.json())
//   .then(res => console.log(res, "result"));
const luckyBot = new Telegraf(tkn);

// discountBot.start(ctx => ctx.reply("Very welcome"));
// discountBot.help(ctx => ctx.reply(helpDescription));
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
const gamesKeyboard = [
  [
    {text: "Random number", callback_data: "randomNumGame"},
    {text: "Dices", callback_data: "diceGame"},
  ],
  [{text: "Game", callback_data: "anyGame"}],
  [{text: "Close", callback_data: "closeGameKb"}],
];
luckyBot.start(ctx => {
  ctx.reply("Welcome, luckers", Markup.inlineKeyboard(gamesKeyboard));
});

luckyBot.command("games", ctx => {
  ctx.replyWithHTML("Choose game", Markup.keyboard(gamesKeyboard));
});
luckyBot.action("diceGame", async (ctx, nextTick) => {
  ctx.replyWithDice();
  nextTick();
});
luckyBot.action("closeGameKb", async (ctx, nextTick) => {
  ctx.reply("Think about it", Markup.removeKeyboard());
  nextTick();
});
luckyBot.action("anyGame", (ctx, nextTick) => {
  ctx.replyWithGame("Test");
  nextTick();
});
luckyBot.launch();
process.once("SIGINT", () => luckyBot.stop("SIGINT"));
process.once("SIGTERM", () => luckyBot.stop("SIGTERM"));
