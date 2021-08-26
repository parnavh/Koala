module.exports = {
    name : 'ping',
    description : 'Provides the time delay for when you recieve my messages with respect to your message',
    args : false,
    perms : ['SEND_MESSAGES'],
    disp : ['Send Messages'],
    category : 'misc',

    
    async execute(client,message,args){
        const get = Date.now() - message.createdTimestamp; //server se
        const reply = await message.channel.send(`Doesn't really mean anything, but here are the stats`);
        const replytime = reply.createdTimestamp - message.createdTimestamp; //replied in 
        reply.edit(`Doesn't really mean anything, but here are the stats\nI got your message in \`${get}\`ms from the server\nAnd took \`${replytime-get}\`ms to send a message\nDiscord's api has a latency of \`${Math.round(message.client.ws.ping)}\`ms`)
    }
};