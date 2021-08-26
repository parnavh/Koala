module.exports = {
    name : 'cs',
    aliases : ['csgo'],
    description : 'A command to summon the roster',
    usage : '[in/at] [time]',
    args : false,
    perms: ['SEND_MESSAGES'],
    disp : ['Send Messages'],
    special_perms : ['731123614619009084'],
    guild : ['424236797309222922'],
    category : 'guild',
    
    
    execute(client,message,args){
        switch(args[0]){
            case 'at':
            case 'in':
                if(args[1]){
                    message.channel.send(`<@&731123614619009084>\nCS ${args[0]} ${args[1]}?`);
                    break;
                }
            default: 
                message.channel.send(`<@&731123614619009084>\nCS?`);
        }
    }
};