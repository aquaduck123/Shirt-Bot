///FILE MODIFIED
    process.chdir(__dirname)
    process.stdin.resume();
    async function exitHandler(options, exitCode) {
 
        if (exitCode || exitCode === 0) console.log(exitCode);
        if (options.exit) {
            console.log()
        }
      }
    process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
    ///FILE MODIFIED

const fs = require('fs');
const axios = require("axios")
const Discord = require('discord.js');
const { Client, MessageEmbed, PermissionsBitField } = require('discord.js');
const bot = new Client( { intents: 33283});
const badWords = require("./JSONs/badWords.json")
const config = require("./config.json")

let shirttalk_channels = require("./JSONs/shirttalk.json")
var shirtinstruct_channels_ids = require("./JSONs/shirtinstruct.json")

let shirttalk_channel_ids = []
for (const channel of shirttalk_channels) {
  shirttalk_channel_ids.push(channel.id)
}
function subArr(arr, i) {
  let newArr = []
  for (var x = 0; x < i && x < arr.length; x++) {
    newArr[x] = arr[x]
  }
  return newArr
}

function subPrefixes(content) {
  for (const prefix of config.prefixes) {
    if (prefix === content.substring(0, prefix.length)) return content.replace(prefix, '--')
  }
  return content
}


bot.on("messageCreate", async message => {
  if (message.author.bot) return
  message.content = subPrefixes(message.content)
  if (shirttalk_channel_ids.includes(message.channel.id) && !message.author.bot) {


    if (!message.content.startsWith("--") && !message.content.startsWith("#")) {
      if (message.system || !message.content) return
      message.channel.sendTyping()
   
      var temp = await collect_messages(message.channel, config.limit)

      if (temp == undefined) return
      let messages = temp.messages
      let authors = subArr(temp.authors, 4)

      var prompt = ""
      for (const message of messages) {
        prompt += (message + "\n")
      }
      let g = await (await message.guild.fetch()).members.fetch(bot.user.id)

      if (g.nickname) {
        
        prompt += `${g.nickname}:`
      } else {
        prompt += `${bot.user.username}:`
      }


      var randomness = shirttalk_channels.find(o => o.id === message.channel.id).randomness;
    
      
      getRequest(prompt, message, randomness, authors)


    }

  }


  if (((message.content.includes(`<@${bot.user.id}>`) || message.content.includes(`<@!${bot.user.id}>`)) && message.author.id !== bot.user.id)) {

    if (shirttalk_channel_ids.includes(message.channel.id) || shirtinstruct_channels_ids.includes(message.channel.id)) return
    if(config.modOnlyPing && !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return
    message.channel.sendTyping()
    var temp = await collect_messages(message.channel, config.limit)
    let messages = temp.messages
    let authors = subArr(temp.authors, 4)
    let g = await (await message.guild.fetch()).members.fetch(bot.user.id)
    var prompt = ""
    for (const message of messages) {
      prompt += (message + "\n")
    }
    if (g.nickname) {
      prompt += `${g.nickname}:`
    } else {
      prompt += `${bot.user.username}:`
    }

    getRequest(prompt, message, 40, authors)
  } else if (message.mentions.repliedUser) {
   
    if (message.mentions.repliedUser.id === bot.user.id) {
      if(config.modOnlyPing && !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return
      message.channel.sendTyping()
      var temp = await collect_messages(message.channel, config.limit)
      let messages = temp.messages
      let authors = subArr(temp.authors, 4)
      let g = await (await message.guild.fetch()).members.fetch(bot.user.id)
      var prompt = ""
      for (const message of messages) {
        prompt += (message + "\n")
      }
      if (g.nickname) {
        prompt += `${g.nickname}:`
      } else {
        prompt += `${bot.user.username}:`
      }

      getRequest(prompt, message, 40, authors)
    }
  }


  if (!message.content.startsWith("--")) return

  if (message.content.startsWith("--shirttalk toggle")&& message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
    if (shirttalk_channel_ids.includes(message.channel.id)) {
      shirttalk_channel_ids.splice(shirttalk_channel_ids.indexOf(message.channel.id), 1)

      let x = shirttalk_channels.findIndex(a => a.id == message.channel.id)
      shirttalk_channels.splice(x, 1)
      fs.writeFile("./JSONs/shirttalk.json", JSON.stringify(shirttalk_channels, null, 4), function (err) {
        if (err) return console.log(err);
      });



    } else {
      let randomness = message.content.split(" ")
      if (randomness.length > 2) {
        randomness = parseFloat(randomness[2])
        if (!isNaN(randomness)) {
          if (randomness <= 50 && randomness >= 0) {
            // RANDOMNESS IS VALID :D
          }
          else randomness = 40
        }
        else randomness = 40
      }
      else randomness = 40
      shirttalk_channel_ids.push(message.channel.id)
      shirttalk_channels.push({
        id: message.channel.id,
        randomness: randomness
      })
      message.reply(`# Shirt talk set with randomness ${randomness}`)

      fs.writeFile("./JSONs/shirttalk.json", JSON.stringify(shirttalk_channels, null, 4), function (err) {
        if (err) return console.log(err);
      });

    }
  } else if (message.content.startsWith("--shirtinstruct toggle")&& message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {

    if (shirtinstruct_channels_ids.includes(message.channel.id)) {
      shirtinstruct_channels_ids.splice(shirtinstruct_channels_ids.indexOf(message.channel.id), 1)


      fs.writeFile("./JSONs/shirtinstruct.json", JSON.stringify(shirtinstruct_channels_ids), function (err) {
        if (err) return console.log(err);
      });




    } else {
      shirtinstruct_channels_ids.push(message.channel.id)

      fs.writeFile("./JSONs/shirtinstruct.json", JSON.stringify(shirtinstruct_channels_ids), function (err) {
        if (err) return console.log(err);
      });

    }



  } else if (message.content.startsWith("--help")) {
    const embed = new MessageEmbed()
      .setTitle("shirt bot help")
      .setDescription("This is a modified version of Cyclcrclicly's shirt bot which can be found at https://github.com/Cyclcrclicly/shirt-bot. This bot uses OpenAI's GPT models to generate responses to a message or collection of messages. \n Commands are listed below")
      .setFields([
        { name: "--help", value: "Displays this menu" },
        { name: "--instruct", value: "uses OpenAI's instruct beta to try and complete a prompt (also try --yellatme :) )" },
        { name: "--shirttalk toggle", value: "toggles shirttalk in that channel" },
        { name: "--shirtinstruct toggle", value: "toggles shirtinstruct in that channel" }
      ])
      .setFooter("Made by AquaDuck#5358")
      .setTimestamp()
    message.reply({ embeds: [embed] })

  } else if (message.content.startsWith("--generate")) {
    message.channel.sendTyping()
    var messages = await collect_messages(message.channel, config.limit)

    messages = messages.messages
    var prompt = ""
    for (const message of messages) {
      prompt += (message + "\n")
    }
    let g = await (await message.guild.fetch()).members.fetch(bot.user.id)
    prompt += `${g.nickname}:`
    var randomness = 0.7;

    getRequest(prompt, message, randomness)
  }

})

async function collect_messages(channel, limit) {
  let authorNames = []
  var lst = []
  var authors = []
  var messages = await channel.messages.fetch({ limit: limit })

  var contents = []

  messages = Array.from(messages.values())
  let g = await (await messages[0].guild.fetch()).members.fetch()
  for (const message of messages) {

    contents.push(message.content.toLowerCase())
 
    if (!authorNames.includes(message.author.id)) {
     

      if (!g.has(message.author.id)) { return}
      try {
     
        authorNames.push(message.author.id)
        if (message.member.nickname != null) {
          authors.push(message.member.nickname + ": ")
        } else {

          authors.push(message.author.username + ": ")
        }
      } catch (err) { console.error(err) }
    }
  }

  startPos = messages.length;
  for (const prefix of config.prefixes) {
    for (var x = 0; x < contents.length; x++) {
      if (contents[x].startsWith(prefix)) {
        contents[x] = contents[x].replace(prefix, "--")

      }

    }

  }

  if (contents.includes("--reset")) {
    var x = 0;
    while (startPos == messages.length && x < messages.length) {
      if (messages[x].content.startsWith("--reset")) {
        startPos = x
        x = messages.length + 1
      }
      else
        x++
    }
  }
 
  for (var x = 0; x < startPos; x++) {

    var message = messages[x]
    var collected = true
    for (const prefix of config.prefixes) {
      if (message.content.startsWith(prefix)) {
        collected = false
      }
    }
    if (message.content.startsWith("#") || message.content.startsWith("&")) collected = false

    if (collected) {
      if (message.mentions !== undefined) {
        let b = message.mentions.members.toJSON()
        let newmsg = message.content

        for (var member of b) {


          if (member.nickname === null) {
            message.content = newmsg.replace(`<@!${member.id}>`, `@${member.user.username}`)
            message.content = message.content.replace(`<@${member.id}>`, `@${member.user.username}`)
          } else {


            message.content = newmsg.replace(`<@!${member.id}>`, `@${member.nickname}`)
            message.content = message.content.replace(`<@${member.id}>`, `@${member.nickname}`)
          }
        }
      }
      if (message.member.nickname != null) {

        lst.push(`${message.member.nickname}: ${message.content}`)
      } else {

        lst.push(`${message.author.username}: ${message.content}`)
      }
    }
    else if (x == messages.length - 1 && !config.prefixes.includes(message.content.substring(0, 2)))
      lst.push(message.guild.me.nickname + ": ")
  }

  lst.reverse()
 
  return { messages: lst, authors: authors };

}


async function getRequest(prompt, message, randomness, authors) {

  var data = await axios
    .post(`https://api.openai.com/v1/completions`,
      {
        model: config.shirttalk_engine,
        max_tokens: 100,
        prompt: prompt,
      }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config["OPENAI_TOKEN"]}`,
      }
    })
  console.log(data.data)
  data = data.data

  try {
    if (data.error) {
      fs.writeFile("./err.txt", JSON.stringify(data.error, null, 4), function (err) {
        if (err) return console.log(err);
      });
      process.exit(1)
    }
    if (!data.choices[0].text) return

    
    var response = remove_slurs(data.choices[0].text)
    while(response.startsWith("\n")){ response = response.substring(1)}
    response = response.split('\n')[0]
    if (response.length <= 1) return

    message.reply(response)

  }
  catch (error) {
    console.error(error)
  }
}


function boldString(str, find) {
  var reg = new RegExp('(' + find + ')', 'gi');
  return str.replace(reg, '[slur removed]');
}

function remove_slurs(input) {
  for (const word of badWords) {
    while (input.toLowerCase().includes(word)) {
      input = boldString(input, word)
    }
  }
  return input
}

bot.on('ready', async () => {
  console.log(`Bot ready as ${bot.user.tag}`)
  module.exports.bot = bot
  require("./instruct")
})
bot.on('disconnect', function (msg, code) {
  console.log(msg + "\n" + code)
  if (code === 0) return console.error(msg);
  bot.connect();
});

bot.login(config["BOT_TOKEN"])
