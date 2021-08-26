module.exports = {
    name : 'leave',
    aliases : ['l','dismiss'],
    description : 'Makes the bot leave any voice channel it is connexted to',
    usage : [''],
    args : false,
    perms : ['SEND_MESSAGES'],
    disp : ['Send Messages'],
    category : 'voice',
    
    
    execute(client,message,args){
        if (message.guild.me.voice.channel) {
            message.guild.me.voice.channel.leave();
            delete client.cache.voice[message.guild.id];
            message.react('✅');
        } else {
            message.reply("I'm not connected to a voice channel!");
        }
    }
};