const { createAudioPlayer } = require("@discordjs/voice")

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
                client.util.joinVoice(message.member.voice.channel);
            } catch (error) {}
            message.react('✅');
            const {voice} = client.cache;
            const guid = message.guild.id;
            if (!voice[guid])
                voice[guid] = {
                    queue: [],
                    vc: [],
                    delay: [],
                    speaker : [],
                    isPlaying: false,
                    player: createAudioPlayer()
                };
        } else {
            message.reply("You are not connected to a voice channel!");
        }
    }
};