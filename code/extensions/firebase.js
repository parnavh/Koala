const firebase_sdk = require('firebase-admin');
const firebaseConfig = require('../../config_firebase.json')

firebase_sdk.default.initializeApp({
    credential: firebase_sdk.credential.cert(firebaseConfig)
})

const database = firebase_sdk.firestore()
const config = database.collection('config')

class firebase {
    constructor(bot) {
        this.client = bot;
        this.client.cache = {
            voice : {},
            config : {}
        }
    }

    async load_config() {
        let res = await config.get()
        res.docs.forEach( doc => {
            if(doc.id == 'test') return;
            let data = doc.data()
            if(!this.client.cache.config[doc.id]) 
                this.client.cache.config[doc.id] = {};
            this.client.cache.config[doc.id] = data
        })
    }

    async set_doc(collection, doc, val) {
        let document = database.collection(collection).doc(doc)
        if(!(await document.get()).exists)
            return new Error("Invalid path\nSource:\tFirebase->set_doc()")
        document.set(val)
    }
    
    async update_doc(collection, doc, val) {
        let document = database.collection(collection).doc(doc)
        if((await document.get()).exists == false)
            return new Error("Invalid path\nSource:\tFirebase->update_doc()")
        document.update(val)
    }
    
    async delete_doc(collection, doc) {
        let document = database.collection(collection).doc(doc)
        if(!(await document.get()).exists)
            return new Error("Invalid path\nSource:\tFirebase->delete_doc()")
        document.delete();
    }

    async set_path(path, val) {
        let document = database.doc(path)
        if(!(await document.get()).exists)
            return new Error("Invalid path\nSource:\tFirebase->set_path()")
        document.set(val)
    }

    async update_path(path, val) {
        let document = database.doc(path)
        if(!(await document.get()).exists)
            return new Error("Invalid path\nSource:\tFirebase->update_path()")
        document.update(val)
    }

    async get_path(path) {
        let document = database.doc(path)
        let res = await document.get()
        if(!res.exists)
            return new Error("Invalid path\nSource:\tFirebase->get_path()")
        return res.data()
    }

    async delete_path(path) {
        let document = database.doc(path)
        if(!(await document.get()).exists)
            return new Error("Invalid path\nSource:\tFirebase->delete_path()")
        document.delete();
    }

    async upsert(collection, doc, val){
        let document = database.collection(collection).doc(doc)
        if(Object.keys(val).length == 0) {
            if((await document.get()).exists) 
                document.delete()
            return
        }
        database.collection(collection).doc(doc).set(val)
    }

    async update_config(guid) {
        this.upsert('config', guid, this.client.cache.config[guid])
    }
}

module.exports = firebase