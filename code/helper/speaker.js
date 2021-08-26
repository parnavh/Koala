module.exports = {
    name : 'speaker', 
    description : 'Handles the queue and playing of audio',

    
    execute (vc, text, speaker, delay = 0) {
        const { client } = vc;
        sp = speaker
        if(!speaker)
            sp = client.util.getVoiceSpeech(vc.guild.id)
        const {voice} = client.cache;
        const guid = vc.guild.id;

        if(!voice[guid])
            voice[guid] = {
                queue : [],
                vc : [],
                delay : [],
                speaker : [],
                isPlaying : false,
                dispatcher : null,
            };

        var server = voice[guid];

        server.queue.push(text);
        server.vc.push(vc);
        server.speaker.push(sp);
        server.delay.push(delay);

        if(!server.isPlaying) {
            client.helper.get('play').execute(server.vc[0],server.queue[0],server.speaker[0], server.delay[0])
            server.queue.shift();
            server.vc.shift();
            server.speaker.shift();
            server.delay.shift();
        }
    }
}