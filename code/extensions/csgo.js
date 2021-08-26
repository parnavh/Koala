const https = require('https'); //(?:https?:\/\/)?steamcommunity\.com\/(?:profiles|id)\/[a-zA-Z0-9]+

function httpGet_inv(options) {
    return new Promise((resolve,reject) => {
        https.get(options, res => {
            let body = '';

            res.on('data', fragments => {
                body += fragments;
            });

            res.on('end', () => {
                let data
                try {
                    data = JSON.parse(body);
                } catch (error) {
                    console.log('inv is private');
                    reject(null); return;
                }
                if(!data || !data.total_inventory_count || data.total_inventory_count<1) { reject(); return; }
                let toReturn = {};
                data.descriptions.forEach(element => {
                    if(element.marketable && element.tradable){
                        toReturn[element.classid] = {
                            name : element.market_hash_name,
                            amount : 0,
                            isCase : element.market_hash_name.includes('Case')
                        }
                    }
                });
                data.assets.forEach(element => {
                    if(toReturn[element.classid])
                        toReturn[element.classid].amount++;
                })
                resolve(toReturn);
            });

            res.on('error', (e) => {
                reject(null); return;
            })
        })
    })
}

function httpGet_price(options) {
    return new Promise((resolve,reject) => {
        https.get(options, res => {
            let body = '';

            res.on('data', fragments => body += fragments);

            res.on('end', async () => {
                let data;
                try {
                    data = JSON.parse(body);
                    if(data.success) {
                        resolve(data.lowest_price);
                    } else {
                        reject(); return;
                    }
                } catch (error) {
                    reject(null); return;
                }
            });
        })
    })
}

let sanitize = n => {
    let m = n.replace(/ /g,'%20');
    return m.replace('|','%7C');
}

module.exports = {
    async getInv(id) {
        console.log('Retrieving data');
        const options = {
            host: 'steamcommunity.com',
            path: `/inventory/${id}/730/2?l=english&count=5000`,
            method: 'GET'
        }
        let data;
        try {
            data = await httpGet_inv(options);
        } catch (error) {
            return null;
        }
        console.log('Retrieving prices');
        for(let key in data) {
            let temp = await this.getPrice(data[key].name);
            data[key].total_price = temp * data[key].amount;
            data[key].price = temp;
        }
        return data;
    },

    async getPrice(name) {
        const options = {
            host: 'steamcommunity.com',
            path: `/market/priceoverview/?appid=730&market_hash_name=${sanitize(name)}&currency=24`
        }
        let price,i=0;
        do {
            ++i;
            try {
                price = await httpGet_price(options);
                if(price) {
                    price = parseFloat(price.substring(1));
                    return price;
                }
            } catch (error) {
                console.log(options.host+options.path);
            }
        } while (i<10 && !price); return null;
    }
}