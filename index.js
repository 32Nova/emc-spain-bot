const Discord = require("discord.js");
var emc = require("earthmc");
const ms = require("ms");
const fetch = require("node-fetch");
const Minesweeper = require("discord.js-minesweeper");
const moment = require("moment");
require("events").EventEmitter.prototype._maxListeners = 100;
const client = new Discord.Client();

// Pause function
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Random color function
function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

// Login
client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  var startEmbed = new Discord.MessageEmbed()
    .setTitle("Bot started !")
    .setColor("#00FF00")
    .setDescription("Spain Bot has successfully started up.")
    .addFields(
      { name: "Start date (Unix)", value: Date.now(), inline: true },
      {
        name: "Start date",
        value: moment().format("DD/MM/YYYY - HH:mm:ss [UTC ]Z"),
        inline: true,
      }
    )
    .setFooter("Spain bot");

  client.channels.cache.get("722516636350808076").send(startEmbed);

  client.user.setPresence({
    status: "online",
    activity: {
      name: `Startup complete !`,
      type: "WATCHING",
    },
  });
  setInterval(async () => {
    const activities = [
      `/n spawn Spain`,
      `Viva España !`,
      `${client.guilds.cache.get("682588388045488143").memberCount} Members`,
      `Spain Epic!`,
      `Spain gang`,
      `Join Spain!`,
      `Iberia gang`,
      `Portugay 👎`,
      `Huevo`,
      `Feel the epicness`,
      `VIBE CHECK`,
      `obama`,
      `No soy un robot`,
    ];
    const activity = activities[Math.floor(Math.random() * activities.length)];
    await client.user.setActivity(activity, { type: "WATCHING" });
  }, 120000);
});

// Error listener
// Websockets and network
client.on("shardError", (error) => {
  client.channels.cache
    .get("722516636350808076")
    .send(":x: A network error occured...\n```" + error + "```");
});
// API
process.on("unhandledRejection", (error) => {
  client.channels.cache
    .get("722516636350808076")
    .send(":x: An API error occured...\n```" + error + "```");
});

// /restart
client.on("message", (message) => {
  if (message.content === "/restart") {
    if (message.author.id !== "485165406881841152")
      return message.reply("Missing permissions!");
    console.log("Restart occurring using /restart");
    message.channel.send("Restarting...").then(() => {
      process.exit(1);
    });
  }
});

// Anti ad
client.on("message", (message) => {
  if (
    message.content.includes("discord.gg/") ||
    message.content.includes("discordapp.com/invite/")
  ) {
    if (
      !message.member.roles.cache.find((r) => r.id === "682667013444993024") &&
      message.guild.id == "682588388045488143"
    ) {
      message.delete();
      message.reply("no ads :smiling_imp:");
    }
  } else {
  }
});

// /status
client.on("message", (message) => {
  if (message.content.startsWith("/status")) {
    var latency = Date.now() - message.createdTimestamp; // Latency
    var pingapi = client.ws.ping; // API ping
    var usedramB = process.memoryUsage().heapUsed; // Used RAM
    // Uptime
    let utotalSeconds = client.uptime / 1000;
    let udays = Math.floor(utotalSeconds / 86400);
    let uhours = Math.floor(utotalSeconds / 3600);
    utotalSeconds %= 3600;
    let uminutes = Math.floor(utotalSeconds / 60);
    let useconds = Math.floor(utotalSeconds % 60);
    let uptime = `${udays} days, ${uhours} hours, ${uminutes} minutes and ${useconds} seconds`;
    // Uptime end
    var pkg = require("./package.json");
    var version = pkg["versionTrue"];
    var build = pkg["build"];

    const statusEmbed = new Discord.MessageEmbed()
      .setTitle("Status")
      .setColor(randomColor())
      .setDescription(
        `Current bot status, ${moment().format(
          "DD/MM/YYYY - HH:mm:ss [UTC ]Z"
        )}\nVersion ${version} build ${build}`
      )
      .addFields(
        { name: "Latency", value: `${latency}ms` },
        { name: "API ping", value: `${pingapi}ms` },
        {
          name: "RAM",
          value: `${
            Math.round((usedramB / 1024 / 1024 + Number.EPSILON) * 100) / 100
          } MB / 512 MB`,
        },
        { name: "Uptime", value: `${uptime}` }
      )
      .setFooter("Spain bot - /status");
    message.channel.send(statusEmbed);
  }
});

// /citizen <@user> <IGN> <Town>
client.on("message", (message) => {
  if (message.content.startsWith("/citizen ")) {
    // Space is intended
    if (
      message.channel.guild.id === "682588388045488143" &&
      message.member.roles.cache.some(
        (role) => role.id === "682667013444993024"
      )
    ) {
      console.log("Perms OK");
      const args = message.content.slice(9).trim().split(" ");
      console.log(
        `Args sliced. var args = ${args}, args.length = ${args.length}`
      );
      if (!args.length) {
        message.reply(
          "Please specify the user you want to give citizen role to, its IGN and town name\nExample: ``/citizen @Obama#1234 Obama_Gaming Valencia``"
        );
      } else {
        console.log("args.lenght is not null.");
        let role = message.guild.roles.cache.find(
          (r) => r.id === "682667013444993024"
        );
        var user = message.mentions.users.first().id;
        var ign = args[1];
        var town = args[2];

        console.log(
          `Vars defined. var user = ${user}, ign = ${ign}, town = ${town}`
        );

        if (user === "" || ign === "" || town === "") {
          message.reply(
            `Incorrect arguments.\nYou inputed : User = '${user.username}#${user.discriminator}', IGN = '${ign}' and Town = '${town}'`
          );
        } else {
          message.guild.members.cache
            .get(user)
            .setNickname(`${ign} | ${town}`)
            .catch(console.error);
          message.guild.members.cache
            .get(user)
            .roles.add(role)
            .catch(console.error);

          if (user.roles.cache.has(role)) {
            message.reply(
              `Successfully gave Citizen to ${user.username}#${user.discriminator}`
            );
          } else {
            message.reply(
              "An error occured when giving the role, please retry."
            );
          }
        }
      }
    } else {
      message.reply("You do not have permission to use this command!");
    }
  }
});

// /spain-download
client.on("message", async (message) => {
  if (message.content.startsWith("/spain-download")) {
    if (
      message.channel.guild.id === "682588388045488143" &&
      message.channel.id === "722523653140643850"
    ) {
      const args = message.content.slice(15).trim().split(" ");

      if (!args.length) {
        return message.reply(
          `Please specify the map version (type latest for the more recent map).`
        );
      }

      if (args[0] === "1") {
        var fieldtext = [
          "20 August 2020",
          "216 Mo",
          "1",
          "[Google Drive](https://drive.google.com/file/d/1Ms87ZB-_5oA5ShWIM1QU9heyPI4rZlZr/view?usp=sharing)",
        ];

        const dlEmbed = new Discord.MessageEmbed()
          .setTitle("Spain World Download")
          .setColor(randomColor())
          .setDescription(
            "You can download here the Spain map to play it in singleplayer with creative mode.\nPlease do not share the map with outsiders. This is only for nation members :flag_es:"
          )
          .addFields(
            { name: "Date of the map", value: fieldtext[0] },
            { name: "Size", value: fieldtext[1] },
            { name: "Map number", value: fieldtext[2] },
            { name: "Download link", value: fieldtext[3] }
          )
          .setTimestamp()
          .setFooter("Spain bot - World Download");
        message.channel.send(dlEmbed);
      } else {
        if (args[0] === "2") {
          var fieldtext = [
            "20 December 2020",
            "99 Mo",
            "2 - Partially updated",
            "[Google Drive](https://drive.google.com/file/d/1CMEl5TFeORWRcdaLvx9SQ6KZ7nOXsAnG/view?usp=sharing)",
          ];

          const dlEmbed = new Discord.MessageEmbed()
            .setTitle("Spain World Download")
            .setColor(randomColor())
            .setDescription(
              "You can download here the Spain map to play it in singleplayer with creative mode.\nPlease do not share the map with outsiders. This is only for nation members :flag_es:\nNote that this version is PARTIAL - everything was not updated - Only updated Valencia, Porto, Madrid and a bit of wilderness"
            )
            .addFields(
              { name: "Date of the map", value: fieldtext[0] },
              { name: "Size", value: fieldtext[1] },
              { name: "Map number", value: fieldtext[2] },
              { name: "Download link", value: fieldtext[3] }
            )
            .setTimestamp()
            .setFooter("Spain bot - World Download");
          message.channel.send(dlEmbed);
        } else {
          if (args[0] === "3") {
            var fieldtext = [
              "29 December 2020",
              "94 Mo",
              "3",
              "[Google Drive](https://drive.google.com/file/d/1BTrZRgkG2zLrhCyVngWgTHspUFeNIey6/view?usp=sharing)",
            ];

            const dlEmbed = new Discord.MessageEmbed()
              .setTitle("Spain World Download")
              .setColor(randomColor())
              .setDescription(
                "You can download here the Spain map to play it in singleplayer with creative mode.\nPlease do not share the map with outsiders. This is only for nation members :flag_es:\nWhat changed : Updated almost everything except some wilderness, Added a bit of the Nether"
              )
              .addFields(
                { name: "Date of the map", value: fieldtext[0] },
                { name: "Size", value: fieldtext[1] },
                { name: "Map number", value: fieldtext[2] },
                { name: "Download link", value: fieldtext[3] }
              )
              .setTimestamp()
              .setFooter("Spain bot - World Download");
            message.channel.send(dlEmbed);
          } else {
            if (args[0] === "latest" || args[0] === "4") {
              var fieldtext = [
                "31 January 2021",
                "83 Mo",
                "4",
                "[Google Drive](https://drive.google.com/file/d/1VXOq59F3BkPQhepVFuXb97GvGwXLVVxj/view?usp=sharing)",
              ];

              const dlEmbed = new Discord.MessageEmbed()
                .setTitle("Spain World Download")
                .setColor(randomColor())
                .setDescription(
                  "You can download here the Spain map to play it in singleplayer with creative mode.\nPlease do not share the map with outsiders. This is only for nation members :flag_es:\nWhat changed : Updated almost everything except some wilderness."
                )
                .addFields(
                  { name: "Date of the map", value: fieldtext[0] },
                  { name: "Size", value: fieldtext[1] },
                  { name: "Map number", value: fieldtext[2] },
                  { name: "Download link", value: fieldtext[3] }
                )
                .setTimestamp()
                .setFooter("Spain bot - World Download");
              message.channel.send(dlEmbed);
            } else {
              message.reply(
                "Invalid version \nAvailable versions : latest, 1, 2, 3, 4"
              );
            }
          }
        }
      }
    } else {
      message.delete();
    }
  }
});

// /ping
client.on("message", (message) => {
  if (message.content.startsWith("/ping")) {
    var ping = Date.now() - message.createdTimestamp;

    var pingapi = client.ws.ping;

    if (ping < 9999999) {
      var pingc = "#000000";
    }
    if (ping < 5000) {
      var pingc = "#440000";
    }
    if (ping < 2000) {
      var pingc = "#770000";
    }
    if (ping < 1000) {
      var pingc = "#FF0000";
    }
    if (ping < 500) {
      var pingc = "#FF9900";
    }
    if (ping < 200) {
      var pingc = "#FFFF00";
    }
    if (ping < 70) {
      var pingc = "#55FF00";
    }
    if (ping < 20) {
      var pingc = "#00FF00";
    }

    pingEmbed = new Discord.MessageEmbed()
      .setTitle("Ping")
      .setColor(pingc)
      .setDescription(`Latency : ${ping}ms\nAPI : ${pingapi}ms`)
      .setFooter("Pong")
      .setTimestamp();

    message.channel.send(pingEmbed);
  }
});

client.on("message", async (message) => {
  if (
    message.content.startsWith("/help") ||
    message.content.startsWith("/cmds")
  ) {
    const helpEmbed = new Discord.MessageEmbed()
      .setTitle("Spain bot | List of commands")
      .setColor(randomColor())
      .setDescription(
        "**MISC**\n`/help`, `/cmds` : Shows this message\n`/uptime` : Check out the bot's uptime\n`/status` : Displays the bot's RAM usage, ping, uptime\n`/minesweeper <rows> <columns> <mines>` : Play some minesweeper\n`/howgay <user>` : Check the gayness of someone\n`/pengun` : Pengun\n`/meme` : Get a random popular meme from reddit\n`/embed <message>` : Converts your message to a pretty embed\n`/je-e`, `je-e-2` : JE E\n`/cat` : cat\n`/self-destruct` : Makes the bot destroy itself\n`/birb` : Get a random bird image\n\n**SPAIN RELATED**\n`/valencia-map` : Shows the map of Valencia\n`/nation-info` : Shows live information about Spain\n\n**MODERATION**\n`/kick <user>` : Kicks the specified user\n`/ban <user>` : Bans the specified user\n`/mute <user>` : Mutes the specified user\n`/unmute <user>` : Unmutes the specified user\n`/purge <amount>` : Deletes the specified amount of messages in the current channel"
      )
      .setTimestamp()
      .setFooter("Spain bot - May vary depending of server");
    message.channel.send(helpEmbed);
  }

  // /Evalr
  if (message.content.toLowerCase().startsWith("/evalr")) {
    if (message.author.id !== "485165406881841152") return;
    var args = message.content.split(" ").slice(1);

    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      const theEmbed = new Discord.MessageEmbed()
        .setColor("#00ff00")
        .setTitle("Evaluation Success")
        .setDescription(
          `**Expression**\n\`\`\`​${code}\`\`\`\n**Result**\n\`\`\`​${evaled}\`\`\``
        )
        .setTimestamp();
      message.channel.send(theEmbed);
    } catch (err) {
      const errEmbed = new Discord.MessageEmbed()
        .setTitle("Evaluation Failed")
        .setColor("#ff0000")
        .setDescription(`\`\`\`${err}\`\`\``)
        .setTimestamp();
      message.channel.send(errEmbed);
    }
    message.delete();
  }

  if (message.content.startsWith("/evaln")) {
    if (message.author.id !== "485165406881841152") return;
    var args = message.content.split(" ").slice(1);
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
    } catch (err) {
      const errEmbed = new Discord.MessageEmbed()
        .setTitle("Evaluation Failed")
        .setColor("#ff0000")
        .setDescription(`\`\`\`${err}\`\`\``)
        .setTimestamp();
      message.channel.send(errEmbed);
    }
    message.delete();
  }

  if (message.content.toLowerCase().startsWith("/minesweeper")) {
    const args = message.content.split(" ").slice(1);

    const rows = parseInt(args[0]);
    const columns = parseInt(args[1]);
    const mines = parseInt(args[2]);

    if (!rows) {
      return message.channel.send(
        ":warning: Please provide the number of rows. Correct usage is /minesweeper <rows> <columns> <mines>"
      );
    }

    if (!columns) {
      return message.channel.send(
        ":warning: Please provide the number of columns. Correct usage is /minesweeper <rows> <columns> <mines>"
      );
    }

    if (!mines) {
      return message.channel.send(
        ":warning: Please provide the number of mines. Correct usage is /minesweeper <rows> <columns> <mines>"
      );
    }

    const minesweeper = new Minesweeper({ rows, columns, mines });
    const matrix = minesweeper.start();

    return matrix
      ? message.channel.send(matrix)
      : message.channel.send(":warning: You have provided invalid data.");
  }

  if (message.content.toLowerCase().startsWith("/purge")) {
    if (message.channel.type == "dm") return;
    if (
      !message.member.hasPermission("MANAGE_MESSAGES") ||
      !message.author.id == "485165406881841152"
    )
      return message.reply("You don't have permissions!");

    const amount = message.content.slice(7);
    if (amount) {
      if (Number(amount) <= 99 && Number(amount) >= 1) {
        message.channel.bulkDelete(Number(amount) + 1).then(() => {
          message.channel
            .send(
              new Discord.MessageEmbed()
                .setTitle(":white_check_mark: Purge Success")
                .setColor("#00ff00")
                .setDescription(
                  `Messages Deleted : __​${amount}__\nModerator : <@${message.author.id}>`
                )
                .setTimestamp()
                .setFooter("Spain bot - /purge")
            )
            .catch((err) => {
              console.error(err);
              return message.channel.send(
                new Discord.MessageEmbed()
                  .setTitle(":warning: Purge Error")
                  .setColor("#ff0000")
                  .setDescription(
                    `An error occurred while attempting to perform /purge :\n\`\`\`​${err}\`\`\`\nNote : Messages older than 2 weeks cannot be deleted.`
                  )
                  .setTimestamp()
              );
            });
        });
      } else if (Number(amount) >= 99) {
        return message.channel.send(
          `Error : Cannot delete more than __99__ messages at once! Your amount (${amount}) is ${
            Number(amount) - 99
          } messages over the limit!`
        );
      } else {
        return message.channel.send(
          `Error : Cannot delete a zero or negative amount of messages!`
        );
      }
    } else {
      message.reply("You didn't provide the amount of messages to delete!");
    }
  }

  if (message.content.toLowerCase().startsWith("/kick")) {
    if (message.channel.type == "dm") return;
    if (!message.member.hasPermission("KICK_MEMBERS"))
      return message.reply("You do not have permissions!");

    var member = message.guild.member(message.mentions.users.first());
    if (!member) return message.reply("Couldn't find that user!");
    member
      .kick("Kicked by " + message.author.tag + " using Spain bot.")
      .catch(console.error);
    await message.reply("Successfully kicked " + member.tag);
  }
});

// /ban
client.on("message", (message) => {
  if (!message.guild) return;
  if (message.content.startsWith("/ban")) {
    if (!message.member.hasPermission("BAN_MEMBERS"))
      return message.channel.send("You do not have permissions!");
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member
          .ban({
            reason:
              "Banned by " + message.member.user.tag + " using Spain bot ",
          })
          .then(() => {
            message.reply(`Successfully banned ${user.tag}`);
          })
          .catch((err) => {
            message.reply("Couldn't ban user!");
            console.error(err);
          });
      } else {
        message.reply("That user isn't in this guild!");
      }
    } else {
      message.reply("You didn't mention the user to ban!");
    }
  }
});
// /pmute
client.on("message", (message) => {
  if (!message.guild) return;
  if (message.content.startsWith("/pmute")) {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send(
        "You don't have permissions to use this command !"
      );
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        let role = message.guild.roles.cache.find((r) => r.name === "Muted");
        member.roles
          .add(role)
          .then(() => {
            message.reply(`Successfully muted ${user.tag} forever!`);
          })
          .catch((err) => {
            message.reply("Couldn't mute user!\n```" + err + "```");
            console.error(err);
          });
      } else {
        message.reply("That user isn't in this server!");
      }
    } else {
      message.reply("You didn't mention the user to mute!");
    }
  }
});
// /mute
client.on("message", async (message) => {
  if (message.content.startsWith("/mute")) {
    const args = message.content.slice(5).trim().split(/ +/g);
    if (message.member.hasPermission("MANAGE_MESSAGES")) {
      if (message.content !== "/mute") {
        let tomute = message.guild.member(
          message.mentions.users.first() ||
            message.guild.members.cache.get(args[0])
        );
        if (!tomute) return message.reply("Couldn't find user.");
        if (tomute.hasPermission("MANAGE_MESSAGES"))
          return message.reply("This user is a mod/admin, i can't mute him!");
        let muterole = message.guild.roles.cache.find(
          (muterole) => muterole.name === "Muted"
        );
        //start of create role
        if (!muterole) {
          try {
            muterole = await message.guild.createRole({
              name: "Muted",
              color: "#222222",
              permissions: [],
            });
            message.guild.channels.forEach(async (channel, id) => {
              await channel.overwritePermissions(muterole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
              });
            });
          } catch (e) {
            console.log(e.stack);
          }
        }
        //end of create role
        let mutetime = args[1];
        if (!mutetime)
          return message.reply(
            "You didn't specify a duration ! Use /pmute to permanently mute users."
          );

        await tomute.roles.add(muterole.id);
        let amount = 8 + args[0].length + args[1].length;
        let reason = message.content.slice(amount);
        console.log(reason);
        message.reply(
          `<@${tomute.id}> has been muted for ${ms(
            ms(mutetime)
          )} for the reason *${reason}*`
        );

        setTimeout(function () {
          tomute.roles.remove(muterole.id);
        }, ms(mutetime));
      } else
        message.channel.send(
          "**Command : /mute**\n\nSyntax : `/mute <@user> <duration> <reason>`\nDescription : Mutes an user for the specified duration. Can be unmuted with `/unmute <@user>`\nPermissions required : `MANAGE_MESSAGES`\nAliases : None\n__Arguments__\n`<@user>` : The user to mute\n`<duration>` : The duration of the mute. Must end with s/m/h/d (seconds/minutes/hours/days) e.g: 3s, 15m, 2h, 7d\n`<reason>` : Why you muted this user"
        );
    } else message.reply("You do not have permissions to use this command!");
  } else;
});
// /unmute
client.on("message", (message) => {
  if (!message.guild) return;
  if (message.content.startsWith("/unmute")) {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send("You do not have permissions!");
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        let role = message.guild.roles.cache.find((r) => r.name === "Muted");
        member.roles
          .remove(role)
          .then(() => {
            message.reply(`Successfully unmuted ${user.tag}`);
          })
          .catch((err) => {
            message.reply("Couldn't mute user!");
            console.error(err);
          });
      } else {
        message.reply("That user isn't in this server!");
      }
    } else {
      message.reply("You didn't mention the user to mute!");
    }
  }
});
// /cat
client.on("message", (message) => {
  if (message.content.startsWith("/cat")) {
    message.reply("Cat ", {
      files: [
        "https://media.discordapp.net/attachments/313329522332139522/655471787102044260/cat.gif",
      ],
    });
  }
});

// /valencia-map
client.on("message", (message) => {
  if (message.content.startsWith("/valencia-map")) {
    message.channel.send("", {
      files: [
        "https://media.discordapp.net/attachments/667790176184958976/793625319940030464/VALENCIA-ROADMAP-1.png",
      ],
    });
  }
});

// /howgay
client.on("message", (message) => {
  if (message.content.startsWith("/howgay")) {
    var gay = Math.floor(Math.random() * 101);
    if (message.content.slice(8) === "")
      return message.channel.send(
        "Please ping the user i need to check gayness"
      );
    const member = message.content.slice(8);
    const gayEmbed = new Discord.MessageEmbed()
      .setColor(randomColor())
      .setTitle("Gay rate machine")
      .setDescription(member + " is " + gay + "% gay");
    message.channel.send(gayEmbed);
  }
});
// /pengun
client.on("message", (message) => {
  if (message.content === "/pengun") {
    message.reply("Pengun");
  }
});

// /uptime
client.on("message", (message) => {
  if (message.content === "/uptime") {
    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

    const uptimeEmbed = new Discord.MessageEmbed()
      .setColor(randomColor())
      .setTitle("Bot Uptime")
      .setDescription(uptime)
      .setTimestamp()
      .setFooter("Spain bot - Uptime");
    message.channel.send(uptimeEmbed);
  }
});

// /meme
client.on("message", async (message) => {
  if (message.content === "/meme") {
    const { url } = await fetch(
      "https://meme-api.herokuapp.com/gimme"
    ).then((response) => response.json());
    const memeEmbed = new Discord.MessageEmbed()
      .setColor(randomColor())
      .setTitle("Meme")
      .setDescription(`Requested by ${message.member.user.tag}`)
      .setImage(url)
      .setTimestamp()
      .setFooter("Spain bot - /meme");
    message.channel.send(memeEmbed);
  }
});
// /embed
client.on("message", (message) => {
  if (message.content.startsWith("/embed")) {
    const daContent = message.content.slice(7);
    if (daContent === "")
      return message.channel.send("Cant send empty embed dummie");
    const Embed = new Discord.MessageEmbed()
      .setColor(randomColor())
      .setDescription(daContent)
      .setFooter(message.member.user.tag);
    message.channel.send(Embed).catch();
    message.delete();
  }
});

// /je-e
client.on("message", (message) => {
  if (message.content.startsWith("/je-e")) {
    const video =
      "https://cdn.discordapp.com/attachments/667790176184958976/735123101788012654/je_e_1.mp4";
    message.reply("JE E", { files: [video] });
  }
});

// /je-e-2
client.on("message", (message) => {
  if (message.content.startsWith("/je-e-2")) {
    const video =
      "https://cdn.discordapp.com/attachments/570574758522126366/735211522434924676/Jee.mp4";
    message.reply("JE E", { files: [video] });
  }
});

// meem
client.on("message", async (message) => {
  if (message.content.startsWith("/self-destruct")) {
    let messag;
    messag = await message.channel.send(
      "Self destruct initiated. Explosion in 20..."
    );
    for (let i = 1; i <= 19; i++) {
      await sleep(1000);
      messag.edit(`Self destruct initiated. Explosion in ${20 - i}...`);
    }
    await sleep(1000);
    messag.edit("**EXPLOSION PAYLOAD SENT**");
    await sleep(3000);
    message.channel.send("https://youtu.be/dQw4w9WgXcQ");
  }
});

// /birb
client.on("message", async (message) => {
  if (message.content.startsWith("/birb")) {
    const { link } = await fetch(
      "https://some-random-api.ml/img/birb"
    ).then((response) => response.json());
    const birbEmbed = new Discord.MessageEmbed()
      .setColor(randomColor())
      .setTitle("Birb")
      .setDescription(`Requested by ${message.member.user.tag}`)
      .setImage(link)
      .setTimestamp()
      .setFooter("Spain bot - melons");
    message.channel.send(birbEmbed);
  }
});

// /nation-info
/*
client.on("message", async (message) => {
  if (message.content.startsWith("/nation-info")) {
    var spain = await emc.getNation("Spain").then((spain) => {
      return spain;
    });
    const res = spain["residents"];
    const towns = spain["towns"];

    const spaininfo = `**Rey :** ${spain["king"]}\n**Capital :** ${spain["capitalName"]} (X ${spain["capitalX"]}; Z ${spain["capitalZ"]})\n**Total chunks :** ${spain["area"]}\n**Total residents :** ${res.length}\n**Total towns :** ${towns.length}\n**List of towns :** \`\`\`${towns}\`\`\``;

    const spainEmbed = new Discord.MessageEmbed()
      .setColor(randomColor())
      .setTitle("Information about Spain")
      .setDescription(spaininfo)
      .setImage(
        "https://media.discordapp.net/attachments/667790176184958976/809857583376236574/spain.png"
      )
      .setTimestamp()
      .setFooter("Spain bot - Nation Info");
    message.channel.send(spainEmbed);
  }
});
*/

// /server-info
/*
client.on("message", async (message) => {
  if (message.content.startsWith("/server-info")) {
    var serverInfo = await emc.getServerInfo().then((info) => {
      return info;
    });

    if (serverInfo["serverOnline"] == true) {
      var ot = `<:greentick:809691624325513238> Server Online\n${serverInfo["towny"]}/110 Players`;
    } else {
      var ot = `<:redtick:809692054648389637> Server Offline`;
    }

    const serverEmbed = new Discord.MessageEmbed()
      .setColor(randomColor())
      .setTitle("Information about EarthMC")
      .setDescription(ot)
      .setTimestamp()
      .setFooter("Spain bot - Server Info");
    message.channel.send(serverEmbed);
  }
});
*/

// Someone joins the server
client.on("guildMemberAdd", (member) => {
  var ran = console.log(Math.floor(Math.random() * 1024));
  /* ca peut toujours servir
  function ordinal_suffix_of(i) {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }
  */

  if (member.guild.id === "682588388045488143") {
    var raremes = `monkey to the monkey discord monkey, ${member.user.tag}! \nWe now monkey ${member.guild.memberCount} monkey!\n\n:flushed:`;
    var mes = `Welcome to the Spain discord server, ${member.user.tag}! \nWe now have ${member.guild.memberCount} members!`;
    var cha = "682672528996827183";
  } else {
    if (member.guild.id === "721804083673169950") {
      var raremes = `monkey to the monkey discord monkey, ${member.user.tag}! \nWe now monkey ${member.guild.memberCount} monkey!\n\n:flushed:`;
      var mes = `Welcome to the discord server of Zaragoza, ${member.user.tag}! \nWe now have ${member.guild.memberCount} members!`;
      var cha = "721804083673169953";
    } else {
      if (member.guild.id === "654041462710861897") {
        var raremes = `monkey to the monkey discord monkey, ${member.user.tag}! \nWe now monkey ${member.guild.memberCount} monkey!\n\n:flushed:`;
        var mes = `Welcome to the discord server of Valencia, ${member.user.tag}! \nWe now have ${member.guild.memberCount} members!`;
        var cha = "654041462710861954";
      } else {
      }
    }
  }

  if (ran == 69) {
    var fmes = raremes;
  } else {
    var fmes = mes;
  }

  member.guild.channels.cache
    .get(cha)
    .send(
      new Discord.MessageEmbed()
        .setColor("#00ff00")
        .setTitle("Someone just joined!")
        .setDescription(fmes)
    );
});
// Someone leaves the server
client.on("guildMemberRemove", (member) => {
  var quitMessages = [
    `Goodbye ${member.user.tag}, we will miss trying to avoid you around here!`,
    `${member.user.tag} earned the biggay from leaving!`,
    `${member.user.tag} wasn't enough epic to stay here.`,
    `${member.user.tag} litteraly left the server!`,
    `${member.user.tag} was probably ggovi :flushed:`,
    `${member.user.tag} left. How rude!`,
    `${member.user.tag} is gone.`,
    `${member.user.tag} is no more.`,
    `${member.user.tag} saw something cringe.`,
    `${member.user.tag} smelled portguese farts :flushed:`,
    `${member.user.tag} took a crap.`,
    `${member.user.tag} had to go.`,
    `${member.user.tag} was late for school.`,
    `${member.user.tag} couldn't take it anymore.`,
    `${member.user.tag} was not wholesome 100 keanu chungus reddit`,
    `${member.user.tag} was an Imposter. 0 Imposters remain.`,
    `${member.user.tag} est allé à Die en France.`,
    `${member.user.tag} didnt have the jimmy neutron style.`,
    `${member.user.tag} has perished to the Obama boss.`,
    `${member.user.tag} was covered in oil.`,
    `${member.user.tag} was trolled.`,
    `${member.user.tag} returned to monkey.`,
  ];

  if (member.guild.id === "682588388045488143") {
    var cha = "682672528996827183";
  } else {
    if (member.guild.id === "721804083673169950") {
      var cha = "721804083673169953";
    } else {
      if (member.guild.id === "654041462710861897") {
        var cha = "654041462710861954";
      } else {
      }
    }
  }

  member.guild.channels.cache.get(cha).send(
    new Discord.MessageEmbed()
      .setColor("#ff0000")
      .setTitle("Someone just left!")
      .setDescription(
        quitMessages[Math.floor(Math.random() * quitMessages.length)] +
          "\n" +
          `We now have ${member.guild.memberCount} members.`
      )
      .setTimestamp()
  );
});

// Login token
client.login(process.env.TOKEN);
