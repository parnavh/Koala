module.exports = {
    name: "playaudio",
    description: "Plays an coded episode",

    async execute(client, message, args) {
        try {
            if (!voice[guid])
                voice[guid] = {
                    queue: [],
                    vc: [],
                    speaker: [],
                    isPlaying: false,
                    dispatcher: null,
                    timeout: null,
                };
            client.cache.voice[message.guild.id].isplaying = true;
            const conn = await message.member.voice.channel.join();
            await conn.play("./playaudio/play.aac");
            client.cache.voice[message.guild.id].isplaying = false;
            if (client.cache.voice[message.guild.id].queue[0]) {
                client.helper
                    .get("play")
                    .execute(server.vc[0], server.queue[0], server.speaker[0]);
                server.queue.shift();
                server.vc.shift();
                server.speaker.shift();
            }
        } catch (error) {
            message.channel.send(error);
        }
    },
};
