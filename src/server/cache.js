class cache{
    constructor(){
        this.gCache = new Map();
        this.pCache = new Map();
    }

    addGuild(data){
        this.gCache.set(data.id, {...data, timeStamp: new Date()});
    }

    addPlayer(data, guild){
        this.pCache.set(data.id, { guild, ...data});
    }
    getGuild(id){
        return this.gCache.get(id);
    }

    showCache(){
        console.log(this.gCache);
    }
}

module.exports = cache;