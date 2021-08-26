module.exports = {
    name : 'tts',
    aliases : ['t'],
    description : 'A command which turns text to speech and plays it in your voice channel',
    usage : '<your-message> [=>speaker name]',
    args : true,
    perms : ['SEND_MESSAGES'],
    disp : ['Send Messages'],
    category : 'voice',

    
    async execute (client,message,args){
        const vc = message.member.voice.channel;

        if(!vc)
            return message.channel.send("You are not in a voice channel :(");

        let text=``,
            speaker = client.util.getVoiceSpeech(message.guild.id),
            temp='';
        for(let i=0;i<args.length;i++){
            if(args[i].toString().startsWith('=>')){
                temp = args[i].toString().substring(2,args[i].length)
                if(client.util.aws_voices.includes(temp))
                    speaker = temp[0].toUpperCase()+temp.substring(1,temp.length);
            } else 
                text+=args[i]+' ';
        }
        client.helper.get('speaker').execute(vc,text,speaker);
    }
};