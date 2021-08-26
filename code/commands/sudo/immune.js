const { Message } = require("discord.js");
const bot = require('../../main/bot')

module.exports = {
    name : 'immune',
    description : 'Makes me immune',

    /** 
     * @param {Message} message
     * @param {bot} client
     * @param {Array} args
    */
    execute(client,message,args){
        message.react(client.emoji.checkmark)
        if(client.cache.sudo.immune) {
            delete client.cache.sudo.immune
            return
        }
        client.cache.sudo.immune = true
        return
    }
};