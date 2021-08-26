function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = {
    name : 'nuke',
    description : 'A command which deletes all the messages in a channel, by cloning the channel and replacing the original channel with the cloned channel\n(*Beware using this command will cause problems with other bots which try to find the other channel as a clone will replace the original channel, you will have to set it up again with other bots and even with me if you have the channel setup for something*)',
    usage : '[channel(s)]',
    args : false,
    perms : ['MANAGE_CHANNELS','MANAGE_MESSAGES'],
    disp : ['Manage Channels','Manage Messages'],
    special_perms : [''],
    category : 'mod',


    async execute(client,message,args){

        var channels = [];
        if(message.mentions.channels.first()){
            message.mentions.channels.map(cha => channels.push(cha.id));
        } else {
            channels = [`${message.channel.id}`];
        }

        var check = '', collected , delete1, delete2;
        if(channels.length==1){
            if(channels[0]==message.channel.id)
                check = 'Do you really want to nuke this channel?'
            else 
                check = `Do you really want to nuke the <#${channels[0]}> channel?`
        } else {
            check = 'Do you really want to nuke the following channels?\n'
            for(var c of channels){
                check+=`<#${c}> `;
            }
            check+= '\n(*Beware using this command will cause problems with other bots which try to find the other channel as a clone will replace the original channel, you will have to set it up again with other bots and even with me if you have the channel setup for something*)'
        }
        check+='\nType \`y\`(yes) or \`n\`(no) in \`15\` seconds';
        delete1  = await message.channel.send(check);

        const acceptable = ['y','yes','n','no'];
        const filter = m => (m.author.id==message.author.id && acceptable.includes(m.content));
        
        try {
            collected = await message.channel.awaitMessages(filter,{
                time : '15000',
                max : '1',
                errors : ['time']
            })
        } catch (error) {
            delete2 = await message.channel.send("No valid input provided in time, Terminating the command");
            try {
                delete1.delete({timeout : 4000});
                delete2.delete({timeout : 4000});
                message.delete({timeout : 4000});
            } catch (error) {}
            return;
        }
    
        var inp = collected.first().content.toLowerCase();

        if(inp == 'n' || inp == 'no'){
            delete2 = await message.channel.send("Okay, Terminating the command");
            try {
                delete1.delete({timeout : 4000});
                delete2.delete({timeout : 4000});
                collected.first().delete({timeout : 4000});
                message.delete({timeout : 4000});
            } catch (error) {}
            return;
        }

        var err = [],temp = '',newName = '';
        for(var c of channels){
            try {
                temp = makeid(12);
                var channel = client.channels.cache.find(chan => chan.id==c);
                options = {
                    name : temp
                }
                var newChannel = await channel.clone(options)
                await newChannel.setPosition(channel.position);
                newName = channel.name;
                channel.delete();
                newChannel.setName(newName);
            } catch (error) {
                err.push(`${error}\nWhile nuking channel <#${c}>`);
            }
        }
        var channel = message.guild.channels.cache.map( cha => cha.id == message.channel.id)
        if(channel.id){
            try {
                message.delete({timeout : 10000});
                delete1.delete({timeout : 10000});
                collected.first().delete({timeout : 10000});
            } catch (error) {}
        }
    }
};