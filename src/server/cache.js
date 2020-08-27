class cache{
    constructor(){
        this.guildCache = [];
        this.playerCache = [];
    }

    addGuild(data){
        const idx = this.guildCache.indexOf(data);
        // Update current data, or push new entry
        if(idx === -1){
            this.guildCache.push(data);
        }
        else{
            this.guildCache[idx] = data
        }
        console.log(this.guildCache);
    }

    addPlayer(data){
        const idx = this.playerCache.indexOf(data);
        // Update current data, or push new entry
        if(idx === -1){
            this.playerCache.push(data);
        }
        else{
            this.playerCache[idx] = data
        }
    }
}

module.exports = cache;