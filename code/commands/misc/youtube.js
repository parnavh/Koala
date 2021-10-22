const { Message } = require("discord.js");
const bot = require('../../main/bot')

module.exports = {
    name : 'youtube',
    aliases : ['ytt'],
    description : 'Watch youtube videos together in voice channel',
    args : false,
    perms : ['SEND_MESSAGES'],
    disp : ['Send Messages'],
    category : '',

    /** 
     * @param {Message} message
     * @param {bot} client
     * @param {Array} args
    */
    async execute(client,message,args){
        const base = client.util.getEmbed(message, "Youtube", null)
        let vc, m
        vc = message.member.voice.channel;
        if(!vc) {
            base.setDescription("You should be in a voice channel to play minigames");
            message.channel.send({embeds: [base]})
        }

        try {
            m = await client.minigames.youtube_together(vc)
            base.setDescription(m)
            message.channel.send({embeds: [base]})
        } catch (error) {
            base.setDescription(error)
            message.channel.send({embeds: [base]})
        }
    }
};