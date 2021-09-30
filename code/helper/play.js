const fs = require("fs");
const AWS = require("aws-sdk");
AWS.config.loadFromPath("config_aws.json");
const polly = new AWS.Polly();
const { VoiceChannel } = require("discord.js");
const { createAudioPlayer, createAudioResource } = require('@discordjs/voice')
module.exports = {
    name: "play",
    description: "Module which is responsible for playing audio",

    /**
     * @param {VoiceChannel} vc
     * @param {string} text
     * @param {string} speaker
     */
    async execute(vc, text, speaker, delay) {
        const { client } = vc;
        const { voice } = client.cache;
        const guid = vc.guild.id;
        let connection = client.util.getVoice(guid);
        
        const soundPath = `./junk/temp/${guid}.mp3`;
        
        var inp = {
            Text: text,
            VoiceId: speaker,
            OutputFormat: "mp3",
            SampleRate: "24000",
        };
        
        if (!voice[guid])
            voice[guid] = {
                queue: [],
                vc: [],
                delay: [],
                speaker : [],
                isPlaying: false,
                player: createAudioPlayer()
            };

        let server = voice[guid];
        let { player } = server;
        
        server.isPlaying = true;

        if (!connection || vc.id != vc.guild.me.voice.channelId) {
            try {
                connection = await client.util.joinVoice(vc)
                await client.util.timer(100 + delay)
            } catch (error) {
                server.isPlaying = false;
                console.error("Play.js 47\n" + error);
                return
            }
        }
        
        
        polly.synthesizeSpeech(inp, (err, data) => {
            if (err) {
                server.isPlaying = false;
                return console.error(err);
            }
            else {
                fs.writeFile(soundPath, data.AudioStream, (err) => {
                    if (err) {
                        server.isPlaying = false
                        return console.error(err);}
                    else {
                        try {
                            player.play(createAudioResource(soundPath));
                            connection.subscribe(player);
                        } catch (error) {
                            console.log(server);
                            console.log(error);
                            server.isPlaying = false;
                            if (server.queue[0]) {
                                client.helper
                                    .get("play")
                                    .execute(
                                        server.vc[0],
                                        server.queue[0],
                                        server.speaker[0],
                                        server.delay[0]
                                    );
                                server.vc.shift();
                                server.queue.shift();
                                server.speaker.shift();
                                server.delay.shift();
                            }
                            return;
                        }
                        player.on('idle', () => {
                            server.isPlaying = false;
                            if (server.queue[0]) {
                                client.helper
                                    .get("play")
                                    .execute(
                                        server.vc[0],
                                        server.queue[0],
                                        server.speaker[0],
                                        server.delay[0]
                                    );
                                server.vc.shift();
                                server.queue.shift();
                                server.speaker.shift();
                                server.delay.shift();
                            }
                        })
                    }
                });
            }
        });
    },
};