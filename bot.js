const Discord = require('discord.io')
const https = require('https')
const envinfo = require('./envinfoMINE.js') // change to envinfo.js

const championUrl = 'https://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion/'

var bot = new Discord.Client({
  token: envinfo.AUTH_TOKEN,
  autorun: true
})

bot.on('ready', function() {
  console.log('Logged in as %s - %s\n', bot.username, bot.id)
})

bot.on('message', function(user, userID, channelID, message, event) {
  console.log(message)
  let userInputs = message.split(' ')
  if (userInputs.length === 2) {
    let nonChampInfo = {
      isBotCalled: userInputs[0],
      name: userInputs[1]
    }
    if (nonChampInfo.isBotCalled === 'Lol') {
      console.log('2 args item or summoner spell')
      console.log(nonChampInfo)
    }
  }

  if (userInputs.length === 3) {
    let champInfo = {
      isBotCalled: userInputs[0],
      name: userInputs[1],
      ability: userInputs[2]
    }
    if (champInfo.isBotCalled === 'Lol') {
      console.log('3 args champion spell info!')
      console.log(champInfo)
      var x = ''
      switch (champInfo.ability) {
        case 'Q':
          x = 0
          break
        case 'W':
          x = 1
          break
        case 'E':
          x = 2
          break
        case 'R':
          x = 3
          break
      }
      https.get(`${championUrl}${champInfo.name}.json`, res => {
        res.setEncoding('utf8')
        let body = ''
        res.on('data', data => {
          body += data
        })

        res.on('end', () => {
          body = JSON.parse(body)
          let name = body.data[`${champInfo.name}`].id
          let abilityName = body.data[`${champInfo.name}`].spells[x].name
          let abilityDesc = body.data[`${champInfo.name}`].spells[x].description.replace(
            /<br>/g,
            '\n'
          )

          bot.sendMessage({
            to: channelID,
            message: `Champion: ${name} \nAbility: ${abilityName} \n${abilityDesc}`
          })
        })
      })
    }
  }
})
