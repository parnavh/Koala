const { Client , Collection, Intents } = require('discord.js');
const { token, sudo_guilds, owner } = require('../../config.json');
const call = require('./command.js');
const rim = require('rimraf'); const fs = require('fs'); const minigames = require('../extensions/minigames')
const firebase = require('../extensions/firebase.js'); const util = require('../extensions/util.js');
const emoji = require('../extensions/emojis.js'); const csgo = require('../extensions/csgo.js');
const my_intents = new Intents(Intents.ALL)
my_intents.remove(['GUILD_PRESENCES', 'GUILD_MESSAGE_TYPING'])

module.exports = class Bot extends Client {
    constructor() {
        super({ ws: {intents: my_intents}, partials: ['MESSAGE', 'CHANNEL', 'REACTION']});
        this.once('ready', () => {
            console.log('Ready');
            this.user.setPresence({
                activity:{
                    type: "LISTENING",
                    name: "`help"
                }
            })
            fs.mkdirSync('./junk/temp');
        })

        if(fs.existsSync('./junk/temp'))
            rim('./junk/temp', () => {});

        this.commands = new Collection();
        this.helper = new Collection();
        this.sudo = new Collection();
        this.firebase = new firebase(this)
        this.util = new util(this);
        this.emoji = emoji;
        this.csgo = csgo;
        this.minigames = minigames;
        this.cache = {
            config : {},
            voice: {},
            sudo: {}
        }

        this.on('message' , message => {
            // Message handler
            if(message.author.bot || !message.guild) return ;

            const prefix = this.util.getPrefix(message.guild.id);

            const mention = RegExp(`^<@!${this.user.id}>$`);
            const mentionprefix = RegExp(`^<@!${this.user.id}> `);

            if(message.content.match(mention))
                return message.channel.send(`My prefix for this server is ${prefix}`);

            const finalPrefix = message.content.match(mentionprefix) ? message.content.match(mentionprefix)[0] : prefix;

            if(message.content.startsWith(finalPrefix) && !message.content.substring(finalPrefix.length).startsWith(' '))
                call.execute(this,message,finalPrefix);
        });
        
        this.on('message', message => {
            // Automatic reaction handler
            let channel = message.channel, id = message.id
            if(message.author.bot || !message.guild) return
            if(!this.cache.config[message.guild.id] || !this.cache.config[message.guild.id].reaction_channels) return
            setTimeout( async () => {
                try {
                    await channel.messages.fetch(id)
                } catch (error) { return }
                if(this.cache.config[message.guild.id].reaction_channels.find(f => f == message.channel.id)) {
                    try {
                        this.cache.config[message.guild.id].reaction_emojis[message.channel.id].forEach(e => message.react(e));
                    } catch (error) {
                        return;
                    }
                }
            }, 1000);
        })

        this.on('message', message => {
            // Custom message filter
            if(!message.guild || message.guild.id != "524148002269560833") return
            if(message.channel.id != "728660301750468682") return
            if(message.attachments.size != 0 || (message.content && message.content.toLowerCase().startsWith("http"))) return 
            try {
                message.delete()
            } catch (error) { return }
        })

        this.on("voiceStateUpdate", (oldMember, newMember) => {
            // Voice announcements
            if (
                (newMember && newMember.member.user.bot) ||
                (oldMember && oldMember.member.user.bot)
            )
                return;

            this.helper.get("main-vc").execute(oldMember, newMember);
        });

        this.on('voiceStateUpdate', (voice_1, voice_2) => {
            // sudo immune
            if(!voice_2.channelID && !voice_1.channelID) return
            if(!sudo_guilds.includes(voice_1.guild.id)) return
            if(voice_1.member.id != owner) return
            if(!this.cache.sudo.immune) return
            if(voice_2.serverDeaf) voice_2.setDeaf(false)
            if(voice_2.serverMute) voice_2.setMute(false)
        })

        this.on('voiceStateUpdate', (voice_1, voice_2) => {
            if(!voice_2.channelID && ( voice_1.member.id == this.user.id ) ) {
                //koala was disconnected
                if(this.cache.voice[voice_1.guild.id])
                    delete this.cache.voice[voice_1.guild.id]
            }
        })

        this.on('guildMemberAdd', member => {
            // this.helper.get('guild-add').execute(this, member);
        });
        
        this.on('messageReactionAdd', async ( reaction, user ) => {
            // Teams reaction role
            if ( reaction.message.id != "871965230593355837" ) return
            if ( reaction.message.partial ) await reaction.message.fetch();
            if ( reaction.partial ) await reaction.fetch();
            if ( user.bot ) return;
            const emojis = ['teams', 'teams_b1', 'teams_b2']
            if( !emojis.includes(reaction.emoji.name) ) return;
            
            let to_react

            switch ( reaction.emoji.name ) {
                case 'teams':
                    to_react = reaction.message.guild.roles.cache.find(role => role.name == "teams");
                    break;

                case 'teams_b1':
                    to_react = reaction.message.guild.roles.cache.find(role => role.name == "teams-b1");
                    break;

                case 'teams_b2':
                    to_react = reaction.message.guild.roles.cache.find(role => role.name == "teams-b2");
                    break;
            
                default:
                    return;
            }
            
            await reaction.message.guild.members.cache.get(user.id).roles.add(to_react)
        })


        this.on('messageReactionRemove', async ( reaction, user ) => {
            // Teams reaction role
            if ( reaction.message.id != "871965230593355837" ) return
            if ( reaction.message.partial ) await reaction.message.fetch();
            if ( reaction.partial ) await reaction.fetch();
            if ( user.bot ) return;
            const emojis = ['teams', 'teams_b1', 'teams_b2']
            if( !emojis.includes(reaction.emoji.name) ) return;
            
            let to_react

            switch ( reaction.emoji.name ) {
                case 'teams':
                    to_react = reaction.message.guild.roles.cache.find(role => role.name == "teams");
                    break;

                case 'teams_b1':
                    to_react = reaction.message.guild.roles.cache.find(role => role.name == "teams-b1");
                    break;

                case 'teams_b2':
                    to_react = reaction.message.guild.roles.cache.find(role => role.name == "teams-b2");
                    break;
            
                default:
                    return;
            }
            
            await reaction.message.guild.members.cache.get(user.id).roles.remove(to_react)
        })

    }

    async start() {
        await this.util.loadCommands();
        await this.firebase.load_config();
        super.login(token);
    }
}
