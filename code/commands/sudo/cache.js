const { Message } = require("discord.js");
const bot = require('../../main/bot')

module.exports = {
    name : 'cache',
    description : 'Shows cache',

    /** 
     * @param {Message} message
     * @param {bot} client
     * @param {Array} args
    */
    execute(client,message,args){
        console.log(client.cache);
    }
};