module.exports = {
    name: "guild-add",
    description: "This module handles when a person joins a server",

    async execute(client, member) {
        // if(client.util.getDefaultRole(member.guild.id)) {
        //     const role = await member.guild.roles.cache.find(await client.util.getDefaultRole());
        //     member.roles.add(role);
        // }

        let welcome_message = await client.util.getWelcome(member.guild.id);
        if (welcome_message) {
            const data = welcome_message;
            if (data.channel.id == "dm") {
                member.send(data.text.replace(/<@>/g, `<@${member.id}>`));
            } else {
                const channel = member.guild.channels.cache.get( data.channel.id );
                channel.send(data.text.replace(/<@>/g, `<@${member.id}>`));
            }
        }

        // member.roles.add()
    },
};
