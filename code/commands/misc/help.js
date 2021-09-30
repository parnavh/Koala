const bot = require('../../main/bot.js')
const {Message} = require('discord.js')

const {MessageEmbed} = require('discord.js');

const categories = [
    'guild',
    'misc',
    'mod',
    'settings',
    'voice'
]

function isCat(arg,check) {
    if(arg=='guild' && !check) return false;
    return categories.includes(arg);
}


function role(perms) {
    let text = '';
    perms.forEach(p => {
        text+=`<@&${p}> `
    })
    return text;
}

module.exports = {
	name : 'help',
	description : 'List all of available commands or info about a specific command.',
	aliases : ['commands','command'],
    usage : '[command name]', 
    args : false,
    perms: ['SEND_MESSAGES'],
    disp : ['Send Messages'],
    category : 'misc',
    
    /**
     * 
     * @param {bot} client 
     * @param {Message} message 
     * @param {Array} args 
     * @returns 
     */
	execute(client,message, args) {
        const prefix = client.util.getPrefix(message.guild.id);

        const embed = new MessageEmbed()
            .setColor('#B46547')
            .setAuthor(`${message.guild.name}'s Help Menu`, message.guild.iconURL({dynamic : true}))
            .setFooter(`At your service, ${message.member.displayName}`, message.author.displayAvatarURL({dynamic : true}));
            
        const { commands } = client;

        const guilds = []
        commands.filter(m => m.guild).forEach(m => {
            m.guild.forEach(c => {
                guilds.push(c)
            })
        })
        const check = guilds.includes(message.guild.id);

        let command, name;

        if(args[0]){
            name = args[0];
            command = client.util.getCommand(name)
        }

        if(!command){
            if(!isCat(name, check)){
                embed.setTitle('Categories for this server:');
                let i=0;
                categories.forEach((cat) => {
                    if(!check && cat == 'guild') return;
                    embed.addField(client.util.capitalize(cat), `\`${prefix}help ${cat}\`\n\u200b`, true)
                    i++
                    if(i==2){
                        embed.addField('\u200b', '\u200b' , true);
                        i=0;
                    }
                })
                return message.channel.send({embeds: [embed]});
            }
            embed.setTitle(client.util.capitalize(name))
            if(name=='guild'){
                commands.forEach(c => {
                    if(c.guild && (c.guild == message.guild.id || c.guild.includes(message.guild.id))) embed.addField(c.name,`\`${prefix}help ${c.name}\`\n\u200b`, true);
                })
                return message.channel.send({embeds: [embed]});
            }
            commands.forEach(c => {
                if(c.category==name && c.name != 'help') embed.addField(c.name,`\`${prefix}help ${c.name}\`\n\u200b`, true);
            })
            return message.channel.send({embeds: [embed]})
        }
        embed.setTitle(client.util.capitalize(command.name))
        command.description && embed.addField('Description:', command.description)
        command.aliases && embed.addField('Aliases:', command.aliases.join(', '))
        command.usage && embed.addField('Usage:', `\`${prefix}${command.name} ${command.usage}\``)
        command.disp && embed.addField('Permisions required:', command.disp)
        command.special_perms && embed.addField('Special role required:', role(command.special_perms))
        command.category && embed.addField('Category:',client.util.capitalize(command.category))
        return message.channel.send({embeds: [embed]})
	}
};