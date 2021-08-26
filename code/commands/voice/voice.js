const { Message } = require("discord.js");
const bot = require("../../main/bot");

module.exports = {
    name: "voice-settings",
    aliases: ["vs"],
    description: "Handles voice defaults and modules",
    args: false,
    perms: ["MANAGE_GUILD"],
    disp: ["Manage Server"],
    category: "voice",

    /**
     * @param {Message} message
     * @param {bot} client
     * @param {Array} args
     */
    async execute(client, message, args) {
        const prefix = client.util.getPrefix(message.guild.id);
        const default_embed = client.util.getEmbed(
            message,
            "Voice Config",
            "Available options:"
        );
        default_embed
            .addField("Announce", `\`${prefix}vs announce\``, true)
            .addField("Speech voice", `\`${prefix}vs speech\``, true)
            .addField("\u200b", "\u200b", true)
            .addField("Ignored channels", `\`${prefix}vs ignore\``, true)
            .addField("Enabled Channels", `\`${prefix}vs enable\``, true)
            .addField("\u200b", "\u200b", true)
            // .addField("Voice message", `\`${prefix}vs message\``, true)

        const base = client.util.getEmbed(message, "Voice Config", null)
        switch (args.shift()) {
            case 'announce':
                switch(args.shift()) {
                    case 'enable':
                        if(client.cache.config[message.guild.id] && client.cache.config[message.guild.id].voice_disabled == true) {
                            delete client.cache.config[message.guild.id].voice_disabled
                            if(client.cache.config[message.guild.id].voice_enabled) delete client.cache.config[message.guild.id].voice_enabled
                            base.setDescription("Voice Announcement is now enabled")
                            client.firebase.update_config(message.guild.id)
                            return message.channel.send(base)
                        }
                        base.setDescription("Voice Announcement is already enabled")
                        return message.channel.send(base)

                    case 'disable':
                        if(client.cache.config[message.guild.id] && client.cache.config[message.guild.id].voice_disabled == true) {
                            base.setDescription("Voice Announcement is already disabled")
                            return message.channel.send(base)
                        }
                        if(!client.cache.config[message.guild.id]) 
                            client.cache.config[message.guild.id] = {}
                        
                        client.cache.config[message.guild.id].voice_disabled = true
                        if(client.cache.config[message.guild.id].voice_ignored)
                            delete client.cache.config[message.guild.id].voice_ignored
                        client.firebase.update_config(message.guild.id)
                        base.setDescription("Voice Announcement is now disabled")
                        return message.channel.send(base)
                    default:
                        base.addField("Announce:", "Announces when someone joins a voice channel", false)
                            .addField("enable", `\`${prefix}voice announce enable\``, true)
                            .addField("disable", `\`${prefix}voice announce disable\``, true)
                        return message.channel.send(base)
                }
            case 'voices':
            case 'speech':
                let option = args.shift()
                switch (option) {
                    case 'default':
                    case 'reset':
                        if(client.cache.config[message.guild.id])
                        delete client.cache.config[message.guild.id].voice_speech
                        client.firebase.update_config(message.guild.id)
                        base.setDescription("Speech has been reset")
                        return message.channel.send(base)

                    case 'all':
                    case 'list':
                        base.setDescription("List of all available voices/speech:\n[Voice list](https://docs.aws.amazon.com/polly/latest/dg/voicelist.html)")
                        return message.channel.send(base)
                        
                    default:
                        if(client.util.aws_voices.includes(option)) {
                            option = client.util.capitalize(option)
                            base.setDescription(`${option} has been set as your default voice`)
                            if(!client.cache.config[message.guild.id]) client.cache.config[message.guild.id] = {}
                            client.cache.config[message.guild.id].voice_speech = option
                            client.firebase.update_config(message.guild.id)
                            return message.channel.send(base)
                        }
                        base.addField("Speech:", "Change the default voice/speech for this server:", false)
                            .addField("List", `\`${prefix}voice speech list\``, true)
                            .addField("Reset", `\`${prefix}voice speech reset\``, true)
                        return message.channel.send(base)
                }
            // case 'message':
            //     switch (args.shift()) {
            //         case 'first':
            //             let opt_1 = args.shift()
            //             if(opt_1) {
            //                 if(!client.cache.config[message.guild.id]) client.cache.config[message.guild.id] = {}
            //                 client.cache.config[message.guild.id].voice_message_first = opt_1
            //                 client.firebase.update_config(message.guild.id)
            //                 base.setDescription("Voice message has been set")
            //                 return message.channel.send(base)
            //             }
            //             if(client.cache.config[message.guild.id] && client.cache.config[message.guild.id].voice_message_first) {
            //                 base.setDescription(`First Message in this server is:\n${client.cache.config[message.guild.id].voice_message_first}`)
            //                 return message.channel.send(base)
            //             }
            //             base.setDescription("Default message is")
            //             return message.channel.send(base)
                        
            //         case 'general':
            //             let opt_2 = args.shift()
            //             if(opt_2) {
            //                 if(!client.cache.config[message.guild.id]) client.cache.config[message.guild.id] = {}
            //                 client.cache.config[message.guild.id].voice_message_general = opt_2
            //                 client.firebase.update_config(message.guild.id)
            //                 base.setDescription("Voice message has been set")
            //                 return message.channel.send(base)
            //             }
            //             base.setDescription("No message provided, Terminating command")
            //             return message.channel.send(base)

            //         default:
            //             base.addField("Message:", "Change the default voice message used when you join a vc:", false)
            //                 .addField("First", `Used when you are the first\n\`${prefix}voice message first\``, true)
            //                 .addField("General", `Used generally\n\`${prefix}voice message general\``, true)
            //             return message.channel.send(base)
            //     }
            case 'ignored':
            case 'ignore':
                let channels_1 = []
                base.setDescription("Send the id/ids of the channels you want to disable:\nThis can be done my enabling developer mode in User Settings > Advanced > Enable Developer Mode, then right click your voice channel and copy its id\n If you want to disable multiple channels, seperate their ids using a space")
                message.channel.send(base)
                const filter_1 = m => (m.author.id == message.author.id)
                let collected_1
                try {
                    collected_1 = await message.channel.awaitMessages(filter_1,{
                        time : '15000',
                        max : '1',
                        errors : ['time']
                    })
                } catch (error) {
                    return console.error(error);
                }
                let inp_1 = collected_1.first().content.trim().split(/ +/)
                inp_1.forEach( cha => {
                    if(message.guild.channels.cache.find(key => key.id == cha))
                        channels_1.push(cha)
                })
                if(channels_1.length == 0) {
                    base.setDescription("No channels found, Terminating command")
                    return message.channel.send(base)
                }
                if(!client.cache.config[message.guild.id]) client.cache.config[message.guild.id] = {}
                client.cache.config[message.guild.id].voice_ignored = channels_1
                client.firebase.update_config(message.guild.id)
                base.setDescription("Ignored channels have been set")
                return message.channel.send(base)
            case 'enabled':
            case 'enable':
                conf = client.cache.config[message.guild.id] ? client.cache.config[message.guild.id] : null
                if(!conf || typeof conf.voice_disabled == "undefined" || typeof conf.voice_ignored != "undefined") return message.channel.send(base.setDescription("For enabling specific channels you have to disable announce"))
                let channels_2 = [], to_remove = []
                base.setDescription("Send the id/ids of the channels you want to enable:\nThis can be done my enabling developer mode in User Settings > Advanced > Enable Developer Mode, then right click your voice channel and copy its id\n If you want to disable multiple channels, seperate their ids using a space")
                message.channel.send(base)
                const filter_2 = m => (m.author.id == message.author.id)
                let collected_2
                try {
                    collected_2 = await message.channel.awaitMessages(filter_2,{
                        time : '15000',
                        max : '1',
                        errors : ['time']
                    })
                } catch (error) {
                    return console.error(error);
                }
                let inp_2 = collected_2.first().content.trim().split(/ +/)
                inp_2.forEach( cha => {
                    if(client.cache.config[message.guild.id].voice_ignored && client.cache.config[message.guild.id].voice_ignored.includes(cha))
                        return to_remove.push(cha)
                    if(message.guild.channels.cache.find(key => key.id == cha))
                        channels_2.push(cha)
                })
                if(channels_2.length == 0 && to_remove.length == 0) {
                    base.setDescription("No channels found, Terminating command")
                    return message.channel.send(base)
                }
                if(!client.cache.config[message.guild.id]) client.cache.config[message.guild.id] = {}
                if(to_remove.length != 0 ) {
                    if(!client.cache.config[message.guild.id].voice_ignored) client.cache.config[message.guild.id].voice_ignored = []
                    let fixed = []
                    fixed = client.cache.config[message.guild.id].voice_ignored.filter( elem => !to_remove.includes(elem))
                    client.cache.config[message.guild.id].voice_ignored = fixed
                }
                if(channels_2.length != 0) {
                    if(!client.cache.config[message.guild.id].voice_enabled) client.cache.config[message.guild.id].voice_enabled = []
                    let new_array = []
                    new_array = client.cache.config[message.guild.id].voice_enabled.concat(channels_2)
                    client.cache.config[message.guild.id].voice_enabled = new_array
                }
                client.firebase.update_config(message.guild.id)
                base.setDescription("Enabled channels have been set")
                return message.channel.send(base)
            default:
                return message.channel.send(default_embed)
        }
    },
};
