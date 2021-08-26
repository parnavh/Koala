const fetch = require('node-fetch')
const { token } = require('../../config.json')

module.exports = {

    youtube_together(channel) {
        return new Promise( (res, rej) => {
            fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
                method: "POST",
                body: JSON.stringify({
                    max_age: 86400,
                    max_uses: 0,
                    target_application_id: "755600276941176913",
                    target_type: 2,
                    temporary: false,
                    validate: null
                }),
                headers: {
                    "Authorization": `Bot ${token}`,
                    "Content-Type": "application/json"
                }
            }).then(res => res.json())
            .then(invite =>{
                if(!invite.code) return rej("Cannot start minigame")
                res(`Click on the Link to start the Stream:\n[Start Youtube Together](https://discord.com/invite/${invite.code})`)
            })
        })
    },

    betrayal(channel) {
        return new Promise( (res, rej) => {
            fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
                method: "POST",
                body: JSON.stringify({
                    max_age: 86400,
                    max_uses: 0,
                    target_application_id: "773336526917861400",
                    target_type: 2,
                    temporary: false,
                    validate: null
                }),
                headers: {
                    "Authorization": `Bot ${token}`,
                    "Content-Type": "application/json"
                }
            }).then(res => res.json())
            .then(invite =>{
                if(!invite.code) return rej("Cannot start minigame")
                res(`Click on the Link to start the Game:\n[Start Game](https://discord.com/invite/${invite.code})`)
            })
        })
    },

    poker(channel) {
        return new Promise( (res, rej) => {
            fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
                method: "POST",
                body: JSON.stringify({
                    max_age: 86400,
                    max_uses: 0,
                    target_application_id: "755827207812677713",
                    target_type: 2,
                    temporary: false,
                    validate: null
                }),
                headers: {
                    "Authorization": `Bot ${token}`,
                    "Content-Type": "application/json"
                }
            }).then(res => res.json())
            .then(invite =>{
                if(!invite.code) return rej("Cannot start minigame")
                res(`Click on the Link to start the Game:\n[Start Game](https://discord.com/invite/${invite.code})`)
            })
        })
    },

    fishing(channel) {
        return new Promise( (res, rej) => {
            fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
                method: "POST",
                body: JSON.stringify({
                    max_age: 86400,
                    max_uses: 0,
                    target_application_id: "814288819477020702",
                    target_type: 2,
                    temporary: false,
                    validate: null
                }),
                headers: {
                    "Authorization": `Bot ${token}`,
                    "Content-Type": "application/json"
                }
            }).then(res => res.json())
            .then(invite =>{
                if(!invite.code) return rej("Cannot start minigame")
                res(`Click on the Link to start the Game:\n[Start Game](https://discord.com/invite/${invite.code})`)
            })
        })
    }
}