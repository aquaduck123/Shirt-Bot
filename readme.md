# OVERVIEW
This is a modified version of Cyclcrclicly's shirt bot which can be found [here](https://github.com/Cyclcrclicly/shirt-bot). This bot is rewritten in Node JS with more features and customizability. This bot requires an OpenAI key which you can get from [here](https://platform.openai.com/signup)

# REQUIREMENTS
[Node JS](https://nodejs.org/en/) LTS

[Axios](https://axios-http.com/) (npm)

[Discord.js](https://discord.js.org/) v13 (npm)

# SETUP

1. Download the source code and then navigate to the folder
2. Run `npm install --save`
3. Fill out the missing information in `config.json`. 
4. Run `node index.js`

# NOTES
- Censored words can be added/removed in `/JSONs/badWords.json`
- Default channel settings can be changed in `index.js`
- instruct settings can be changed in `instruct.js`
- The fields shirttalk_engine & shirtinstruct_engine may not be up to date depending on when you set this up. You can find the most recent models [here](https://platform.openai.com/docs/models)
- Depending on how much you are willing to spend on this bot, you may want to switch which models you are using. You can find an explaination of the models [here (scroll to InstructGPT)](https://openai.com/pricing)
- Tokens are the total length of the response. Generally, 750 words is around 1000 tokens
- The `limit` value in `config.json` determines how many messages the bot will collect as context. More collected messages = more tokens


<br />
<br />
<br />
<br />
<br />

[Imgur](https://i.imgur.com/pKuTPnh.gifv)
