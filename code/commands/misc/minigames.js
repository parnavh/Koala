const { Message } = require("discord.js");
const bot = require('../../main/bot')
const { prefix } = require('../../../config.json')

module.exports = {
    name : 'minigames',
    aliases : ['mini'],
    description : 'New minigames introduced by discord',
    usage : '[minigame]',
    args : false,
    perms : ['SEND_MESSAGES'],
    disp : ['Send Messages'],
    category : 'misc',

    /** 
     * @param {Message} message
     * @param {bot} client
     * @param {Array} args
    */
    async execute(client,message,args){
        const base = client.util.getEmbed(message, "Minigames", null)
        let vc, m
        vc = message.member.voice.channel;
        if(!vc) {
            base.setDescription("You should be in a voice channel to play minigames");
            message.channel.send(base)
        }
        switch (args.shift()) {
            case "poker":
                try {
                    m = await client.minigames.poker(vc)
                    base.setDescription(m)
                    message.channel.send(base)
                } catch (error) {
                    base.setDescription(error)
                    message.channel.send(base)
                }
                break;

            case "betrayal":
                try {
                    m = await client.minigames.betrayal(vc)
                    base.setDescription(m)
                    message.channel.send(base)
                } catch (error) {
                    base.setDescription(error)
                    message.channel.send(base)
                }
                break;

            case "fishing":
                try {
                    m = await client.minigames.fishing(vc)
                    base.setDescription(m)
                    message.channel.send(base)
                } catch (error) {
                    base.setDescription(error)
                    message.channel.send(base)
                }
                break;
        
            default:
                base.addField("Poker", `\`${prefix}mini poker\``, true)
                base.addField("Betrayal", `\`${prefix}mini betrayal\``, true)
                base.addField("Fishing", `\`${prefix}mini fishing\``,  true)
                message.channel.send(base)
                break;
        }

    }
};