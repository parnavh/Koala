async function awaitResponse (channel, filter) {
    var collected;
    try {
        collected = await channel.awaitMessages(filter,{
            time : '15000',
            max : '1',
            errors : ['time']
        }) 
    } catch (err) {
        channel.send('No valid input provided, terminating command');
        return false;
    }
    if(collected.first().content.toLowerCase().trim() == '--abort') {
        channel.send('Ok terminating the command'); return false;
    }
    return collected.first()
}

const options = [
    'clone','copy',
    'expire','close',
    'edit',
    'express'
];

module.exports = {
    name : 'reaction-role',
    aliases : ['rr','reaction','rrole'],
    description : 'A command which generates a reaction role message',
    usage : '[channel]',
    args : false,
    perms : ['MANAGE_ROLES'],
    disp : ['Manage Roles'],
    category : 'mod',

    
    async execute(client,message,args){
        let filter, inp;
        let embed = new MessageEmbed();
        const rr = new MessageEmbed();
        addBasic(embed);
        
        embed.setDescription(`PLease enter the topic for the reaction role message\nFor eg. Select your platform`);
        message.channel.send(embed);

        filter = m => (m.author.id == message.author.id);

        inp = await awaitResponse(message.channel,filter);
        if(!inp) return;

        
    }
};