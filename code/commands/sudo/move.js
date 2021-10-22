const { Message } = require("discord.js");
const bot = require('../../main/bot')

module.exports = {
    name : 'move',
    description : 'Move all members of vc to another channel',

    /** 
     * @param {Message} message
     * @param {bot} client
     * @param {Array} args
    */
    execute(client, message, args) {
        let destination = args.shift()
        let target = args.shift()

        let destination_channel = message.guild.channels.cache.find(c => c.type == "GUILD_VOICE" && c.name.toLowerCase().includes(destination))
        let target_channel = message.guild.channels.cache.find(c => c.type == "GUILD_VOICE" && c.name.toLowerCase().includes(target))

        if(!target_channel) target_channel = message.member.voice.channel
        if(!target_channel || !destination_channel) return

        target_channel.members.forEach( m => m.voice.setChannel(destination_channel) )

        message.react(client.emoji.checkmark)
    }
};