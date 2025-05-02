import {Markup, Telegraf} from "telegraf";
import {message} from "telegraf/filters";
import {
  ChatMemberAdministrator,
  ChatMemberOwner,
} from "telegraf/typings/core/types/typegram";

const tkn = process.env.USER_FATHER_TKN || "";
const helpDescription = process.env.USER_BOT_HELP || "...";

const luckyBot = new Telegraf(tkn);
let currentRandomNumber: number | null = null;
let isRockPaperGameActive = false;

const Emojies = {
  "🤚": 1,
  "🖐": 1,
  "✌️": 2,
  "✊": 3,
};

let rockPaperPlayersAndResults: {
  player: string;
  emoji: string;
  value: number;
}[] = [];

const gamesKeyboard = [
  [
    {
      text: "Number",
      callback_data: "randomNumber",
    },
    {text: "Dice", callback_data: "diceGame"},
  ],
  [{text: "Rock, Paper, Scissors", callback_data: "rockPaperGame"}],
  [
    {
      text: "Close",
      callback_data: "closeKeyboard",
    },
  ],
];
luckyBot.start(ctx => {
  if (isRockPaperGameActive || currentRandomNumber) {
    ctx.reply("Начата другая игра");
    return;
  }

  ctx.reply("Well, let`s play", Markup.inlineKeyboard(gamesKeyboard));
});
luckyBot.help(ctx => ctx.reply(helpDescription));
//commands
luckyBot.command("games", ctx => {
  if (isRockPaperGameActive || currentRandomNumber) {
    ctx.reply("Начата другая игра");
    return;
  }
  ctx.reply("Games", Markup.inlineKeyboard(gamesKeyboard));
});
luckyBot.command("show_number", ctx => {
  ctx.reply(
    currentRandomNumber
      ? `Загаданное число ${currentRandomNumber}`
      : "Не покажу",
  );
});
luckyBot.command("reset", ctx => {
  currentRandomNumber = null;
  isRockPaperGameActive = false;
  rockPaperPlayersAndResults = [];
  ctx.reply("Состояние обнулено");
});
luckyBot.command("lucker", async ctx => {
  const membersList = await luckyBot.telegram.getChatAdministrators(
    ctx.update.message.chat.id,
  );

  const shortUsersInfo = membersList.map(
    (item: ChatMemberOwner | ChatMemberAdministrator) => item.user,
  );

  shortUsersInfo.shift();
  const randomIndex = Math.floor(Math.random() * shortUsersInfo.length);

  ctx.reply(`Везунчик - @${shortUsersInfo[randomIndex].username}`);
});
//actions
luckyBot.action("rockPaperGame", ctx => {
  isRockPaperGameActive = true;
  ctx.reply(
    'Игра "Камень-Ножницы-Бумага" началась. Принимаются смайлы ✊, ✌️, 🖐, 🤚. Для сохранения интереса требуется оборачивать смайлы в ||. Пример: ||✊||.',
  );
  ctx.editMessageReplyMarkup({inline_keyboard: []});
});
luckyBot.action("randomNumber", ctx => {
  currentRandomNumber = Math.floor(Math.random() * 10);
  ctx.reply(`Случайно число загадано от 1 до 10`);
  ctx.editMessageReplyMarkup({inline_keyboard: []});
});

luckyBot.action("diceGame", ctx => {
  ctx.replyWithDice();
  ctx.editMessageReplyMarkup({inline_keyboard: []});
});

luckyBot.action("closeKeyboard", ctx => {
  ctx.editMessageReplyMarkup({inline_keyboard: []});
});

//functions
luckyBot.hears(["✊", "✌️", "🖐", "🤚"], async ctx => {
  const currentPlayerNick = ctx.update.message.from.username;
  const isAlreadyHas = rockPaperPlayersAndResults.some(
    el => el.player === currentPlayerNick,
  );
  if (isAlreadyHas) {
    ctx.reply(`@${currentPlayerNick} не жульничай!`);
    return;
  }

  rockPaperPlayersAndResults.push({
    player: currentPlayerNick || "",
    emoji: ctx.update.message.text,
    value: Emojies[ctx.update.message.text as keyof typeof Emojies],
  });
  if (rockPaperPlayersAndResults.length >= 1) {
    ctx.reply(
      "Завершить?",
      Markup.keyboard(["Завершить камень,ножницы,бумага"]).resize(),
    );
  }
});

luckyBot.hears("Завершить камень,ножницы,бумага", async ctx => {
  ctx.reply("Подведем итоги");
  const emojiValues = Array.from(
    new Set(rockPaperPlayersAndResults.map(item => item.value)),
  );
  if (emojiValues.length !== 2) {
    rockPaperPlayersAndResults = [];
    setTimeout(() => ctx.reply("Нужно переиграть"), 1000);
    return;
  }
  let winners: {player: string; emoji: string}[] = [];
  rockPaperPlayersAndResults.forEach(el => {
    //ножницы
    if (!emojiValues.includes(3)) {
      el.value === 2 && winners.push({player: el.player, emoji: el.emoji});
      return;
    }
    //бумага
    if (!emojiValues.includes(2)) {
      el.value === 1 && winners.push({player: el.player, emoji: el.emoji});
      return;
    }
    //камень
    if (!emojiValues.includes(1)) {
      el.value === 3 && winners.push({player: el.player, emoji: el.emoji});
      return;
    }
  });
  winners.forEach(winner => {
    ctx.reply(`Победил(а) @${winner.player} : ${winner.emoji}`);
  });
  //end
  rockPaperPlayersAndResults = [];
  isRockPaperGameActive = false;
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
    ctx.reply(
      `@${ctx.update.message.from.username} угадал(а). Число ${currentRandomNumber}`,
    );
    currentRandomNumber = null;
  }
});

luckyBot.launch();
process.once("SIGINT", () => luckyBot.stop("SIGINT"));
process.once("SIGTERM", () => luckyBot.stop("SIGTERM"));
