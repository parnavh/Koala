const { Message } = require("discord.js");
const bot = require('../../main/bot')

module.exports = {
    name : 'unmute',
    description : 'Unmutes a person and gives them chance to mute themselves',
    args : false,
    perms : ['SEND_MESSAGES'],
    disp : ['Send Messages'],
    category : 'guild',
    guild : ['424236797309222922'],

    /** 
     * @param {Message} message
     * @param {bot} client
     * @param {Array} args
    */
    execute(client,message,args){
        if(client.cache.sudo.cooldown && client.cache.sudo.cooldown[message.member.id]) return
        if (!message.member.voice) return
        let voiceState = message.member.voice
        if(!voiceState.mute) return

        voiceState.setMute(false)
        
        if(!client.cache.sudo.cooldown) client.cache.sudo.cooldown = {}
        client.cache.sudo.cooldown[message.member.id] = setTimeout(() => {
            delete client.cache.sudo.cooldown[message.member.id]
        }, 2 * 60 * 1000);

        setTimeout(() => {
            if(message.member.voice && !message.member.voice.selfMute) message.member.voice.setMute(true)
        }, 5 * 1000);
    }
};