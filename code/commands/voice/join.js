module.exports = {
    name : 'join',
    aliases : ['j','summon'],
    description : 'Makes the bot join the voice channel',
    args : false,
    perms : ['SEND_MESSAGES'],
    disp : ['Send Messages'],
    category : 'voice',
    
    
    async execute(client,message,args){
        if (message.member.voice.channel) {
            try {
                await message.member.voice.channel.join();
            } catch (error) {}
            message.react('✅');
            const {voice} = client.cache;
            const guid = message.guild.id;
            if(!voice[guid])
                voice[guid] = {
                    queue : [],
                    vc : [],
                    speaker : [],
                    isPlaying : false,
                    dispatcher : null,
                };
        } else {
            message.reply("You are not connected to a voice channel!");
        }
    }
};