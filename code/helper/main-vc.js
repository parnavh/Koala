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
        const { helper } = newMember.client;
        const { client } = newMember;
        if (!oldMember.channelID) {
            if (!client.util.isVoiceAllowed(newMember)) return;
            let text = `${newMember.member.displayName} has joined`,
                size = newMember.channel.members.size;

            if (size == 1) text = `Welcome ${newMember.member.displayName}`;

            helper.get("speaker").execute(newMember.channel, text, null, 1100);
        }
        if (!newMember.channelID) {
            if (!client.util.isVoiceAllowed(oldMember)) return;
            let text,
                size = oldMember.channel.members.size;
            if (
                size == 1 &&
                oldMember.guild.voice &&
                oldMember.guild.voice.channelID == oldMember.channelID
            )
                oldMember.channel.leave();
            else if(size != 0) {
                text = `${oldMember.member.displayName} has left`;
                helper.get("speaker").execute(oldMember.channel, text, null, 0);
            }
        }
        if (newMember.channel && oldMember.channel) {
            let i = oldMember.channel.members.size;
            if (
                i == 1 &&
                oldMember.channel &&
                oldMember.guild.voice &&
                oldMember.guild.voice.channel &&
                oldMember.channel.id == oldMember.guild.voice.channel.id
            ) {
                oldMember.channel.leave();
            }
        }
    },
};
