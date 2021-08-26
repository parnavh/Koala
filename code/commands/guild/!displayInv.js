// https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=8C6463430CF0C8E0071C5CB012DE6595&vanityurl=parnav
module.exports = {
    name : 'displayinv',
    aliases : ['inv','test'],
    description : 'Displays the inventory items',
    usage : '',
    args : false,
    perms: ['SEND_MESSAGES'],
    disp : ['Send Messages'],
    guild : ['780901934768193567'],
    category : 'guild',

    
    async execute(client,message,args){
        let id = '76561198319032064';//76561199038628267
        // if(args) id = args;
        const test = await client.csgo.getInv(id);
        console.log(test);
    }
};