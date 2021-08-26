const fs = require("fs");
const AWS = require("aws-sdk");
AWS.config.loadFromPath("config_aws.json");
const polly = new AWS.Polly();
const { VoiceChannel } = require("discord.js");
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
        let connection = vc.guild.me.voice ? vc.guild.me.voice.connection : null;
        
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
            isPlaying: false,
            dispatcher: null,
        };

        server = voice[guid];
        
        server.isPlaying = true;

        if (!connection || vc.id != connection.channel.id) {
            try {
                connection = await vc.join();
                await client.util.timer(100 + delay)
            } catch (error) {
                server.isPlaying = false;
                console.error("Play.js 33\n" + error);
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
                            server.dispatcher = connection.play(soundPath);
                        } catch (error) {
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
                        server.dispatcher.on("finish", () => {
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
                        });
                    }
                });
            }
        });
    },
};