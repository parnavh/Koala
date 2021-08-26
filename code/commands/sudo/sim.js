module.exports = {
    name: 'sim',
    description: 'Simulates a situation',

    execute(client,message,args) {
        client.helper.get('guild-add').execute(client,message.member);
    }
}