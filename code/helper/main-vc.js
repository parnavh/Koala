const { VoiceState } = require("discord.js");
module.exports = {
    name: "main-vc",
    description:
        "The main sleeper vc command responsible for announcing someone's arrival/departure",

    /**
     *
     * @param {VoiceState} oldMember
     * @param {VoiceState} newMember
     * @returns
     */
    async execute(oldMember, newMember) {
        const { client } = newMember;
        const speaker = client.helper.get("speaker").execute;
        
        if (newMember.channelId && oldMember.channelId) {
            if (
                oldMember.channel.members == 1 &&
                oldMember.channelId == oldMember.guild.me.voice?.channelId
            ) client.util.getVoice(oldMember.guild.id).disconnect();
            return;
        }

        if (newMember.channelId) {
            if (!client.util.isVoiceAllowed(newMember) || newMember.member.user.bot) return;
            let text = `${newMember.member.displayName} has joined`;

            if (newMember.channel.members.size == 1) text = `Welcome ${newMember.member.displayName}`;

            speaker(newMember.channel, text, null, 1100);
            return;
        }

        if (oldMember.channelId) {
            let text, { size } = oldMember.channel.members;
            if (
                size == 1 &&
                oldMember.guild.me.voice?.channelId == oldMember.channelId
            )
                client.util.getVoice(oldMember.guild.id).disconnect()
            else if(size != 0 && client.util.isVoiceAllowed(oldMember) && !oldMember.member.user.bot) {
                text = `${oldMember.member.displayName} has left`;
                speaker(oldMember.channel, text, null, 0);
            }
            return;
        }
    },
};
