module.exports = {
    name : 'clear',
    aliases : ['delete','purge','del'],
    description : 'Clears the specified amount of messages ',
    usage : '[Channel(s)] <Number of messages to be deleted>',
    args : true,
    perms : ['MANAGE_MESSAGES'],
    disp : ['Manage Messages'],
    category : 'mod',


    async execute(client,message,args){
        var channels = [];
        if(message.mentions.channels.first()){
            message.mentions.channels.map(cha => channels.push(cha.id));
        } else {
            channels = [`${message.channel.id}`];
        }
        var final ='';        
        for(var a of args){
            if(!a.startsWith('<#')) {
                var t = a.toString();
                if(!isNaN(t)&&!isNaN(parseFloat(t))){
                    final = a ;
                    break;
                }
            }
        }
        if(final==''){
            return message.reply("You didn't specify the number of messages to be deleted in the proper format.");
        }

        var check = '',collected, delete1 ,delete2 ;
        if(channels.length>2){
            check = `Do you really want to clear \`${final}\` messages from the following channels?\n`
            for(var c of channels){
                check+=`<#${c}> `;
            }
            check+='\nType \`y\`(yes) or \`n\`(no) in \`15\` seconds';
            delete1 = await message.channel.send(check);

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
        }

        var e = [],t;
        for(var c of channels){
            var d = final;
            if(c==message.channel.id)
                await message.delete();
            var channel = client.channels.cache.find(chan => chan.id==c);
            do{
                if(d==1) {
                    await channel.send('😴');
                    t=2;
                    d=0;
                } else if(d<100) {
                    t=d;
                    d=0;
                } else {
                    t=99;
                    d-=99;
                }
                try {
                    const messages = await channel.bulkDelete(t, true);
                    if (messages.size != t) {
                        let text=''
                        text += `I have deleted \`${messages.size}\` messages` 
                        if(channels.length!=1)
                            text += ` in <#${c}>` 
                        text += ` since Discord limits me from deleting messages which were sent past 2 weeks`;
                        e.push(text);
                        d=0;
                    } else if(channels.length!=1) {
                        e.push(`Succesfully deleted \`${t}\` messages in <#${c}>`);
                    }
                } catch (err) {}
            } while (d!=0);
        }
        if(e.length==0){
            const msg = await message.channel.send(`The messages have been deleted 👍`);
            try {
                msg.delete({timeout : 4000});
            } catch (error) {}
        } else {
            const msg = await message.channel.send(e, {split : true});
            for(var m=0;m<msg.length;m++){
                try {
                    msg[m].delete({timeout : 10000});
                } catch (error) {}
            }
            try {
                message.delete({timeout : 10000});
                delete1.delete({timeout : 10000});
                collected.first().delete({timeout : 10000});
            } catch (error) {}
        }
    }
};