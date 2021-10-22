const fs = require('fs');
const { prefix } = require('../../config.json');
const bot = require('../main/bot.js')
const { MessageEmbed, VoiceChannel } = require('discord.js')
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, AudioPlayerStatus } = require("@discordjs/voice");

module.exports = class Util {

    /**
     * 
     * @param {bot} client 
     */
	constructor(client) {
		this.client = client;
    }

    aws_voices = [
        'aditi',    'amy',       'astrid',   'bianca',
        'brian',    'camila',    'carla',    'carmen',
        'celine',   'chantal',   'conchita', 'cristiano',
        'dora',     'emma',      'enrique',  'ewa',
        'filiz',    'gabrielle', 'geraint',  'giorgio',
        'gwyneth',  'hans',      'ines',     'ivy',
        'jacek',    'jan',       'joanna',   'joey',
        'justin',   'karl',      'kendra',   'kevin',
        'kimberly', 'lea',       'liv',      'lotte',
        'lucia',    'lupe',      'mads',     'maja',
        'marlene',  'mathieu',   'matthew',  'maxim',
        'mia',      'miguel',    'mizuki',   'naja',
        'nicole',   'olivia',    'penelope', 'raveena',
        'ricardo',  'ruben',     'russell',  'salli',
        'seoyeon',  'takumi',    'tatyana',  'vicki',
        'vitoria',  'zeina',     'zhiyu'
    ]

    getPrefix(id) {
        if(!id) throw new TypeError("No id specified");
        if(this.client.cache.config[id] && this.client.cache.config[id].prefix) {
            return this.client.cache.config[id].prefix;
        }
        return prefix;
    }

    getWelcome(id) {
        if(!id) throw new TypeError("No id specified");
        if(this.client.cache.config[id] && this.client.cache.config[id].welcome_text) {
            let toReturn = {
                text: this.client.cache.config[id].welcome_text,
                channel_id: this.client.cache.config[id].welcome_channel
            }
            return toReturn;
        }
        return false;
    }
    
	async loadCommands() {
        const ignored = ['sudo'];
		const commandFiles = fs.readdirSync('./code/commands')
        for(let dirs of commandFiles){
            if(!fs.lstatSync(`./code/commands/${dirs}`).isDirectory() || ignored.includes(dirs)) continue;
            const commands = fs.readdirSync(`./code/commands/${dirs}/`)
            commands.forEach(com => {
                const temp = require(`../commands/${dirs}/${com}`);
                this.client.commands.set(temp.name, temp);
            });
        }

        const sudoFiles = fs.readdirSync('./code/commands/sudo').filter(file => file.endsWith('.js'));
        sudoFiles.forEach(file => {
            const command = require(`../commands/sudo/${file}`);
            this.client.sudo.set(command.name, command);
        })

        const helperFiles = fs.readdirSync('./code/helper').filter(file => file.endsWith('.js'));
        helperFiles.forEach(file => {
            const command = require(`../helper/${file}`);
            this.client.helper.set(command.name, command);
        })
    }

    getCommand(commandName,id) {
        const command = this.client.commands.find(c => {
            if(c.name == commandName || (c.aliases && c.aliases.includes(commandName))){
                if(c.category == 'guild') {
                    if(c.guild && c.guild.includes(id)) return c
                } else {
                    return c;
                }
            }
        })
        return command;
    }

    getDefaultRole(id) {
        let role 
        if(this.client.cache.config[id] || this.client.cache.config[id].welcome_role) role = this.client.cache.config[id].welcome_role
        return role
    }

    getEmbed(message, title, text) {
        let toReturn = new MessageEmbed()
            .setColor('#B46547')
            .setFooter(`At your service, ${message.member.displayName}`, message.author.displayAvatarURL({dynamic : true}))
            .setAuthor(`${message.guild.name}`, message.guild.iconURL({dynamic : true}))
        text && toReturn.setDescription(text);
        title && toReturn.setTitle(title);
        return toReturn;
    }

    getDefaultEmbed(title, text) {
        let to_return = new MessageEmbed()
            .setColor("#B46547")
        
        title && to_return.setTitle(title)
        text && to_return.setDescription(text)

        return to_return
    }

    capitalize = (str) => str.charAt(0).toUpperCase() + str.substring(1)

    // getVoiceMessage_first(guid) {
    //     return this.client.cache.config[guid].voice_message_first ? this.client.cache.config[guid].voice_message_first : ""
    // }
    // getVoiceMessage_general(guid) {
    //     return this.client.cache.config[guid].voice_message_general ? this.client.cache.config[guid].voice_message_general : "<@> has joined"
    // }

    getVoiceSpeech(guid) {
        if(this.client.cache.config[guid] && this.client.cache.config[guid].voice_speech)
            return this.client.cache.config[guid].voice_speech
        return "Joanna"
    }

    isVoiceAllowed(voice) {
        let conf = this.client.cache.config[voice.guild.id]
        if(!conf)
            return true
        if(conf.voice_disabled) {
            if(conf.voice_enabled && conf.voice_enabled.includes(voice.channel.id))
                return true
            return false
        }
        if(conf.voice_ignored && conf.voice_ignored.includes(voice.channel.id))
            return false
        return true
    }

    timer = ms => new Promise(res => setTimeout(res, ms));

    /**
     * @param {VoiceChannel} channel 
     */
    joinVoice(channel) {
        return joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        })
    }

    getVoice = getVoiceConnection;
};