let urlDBModel = require('./models/urlDB');

const dbFunctions = {
    generateRandomCode: () => {
        let val = "";
        while(val.length < 6) {
            val += String.fromCharCode(97 + Math.floor(Math.random()*26));
        }
        return val;
    },
    findUrl: async (code) => {
        let res;
        await urlDBModel.find({
            short_url: code   // search query
          })
          .then(doc => {
            console.log("found", doc)
            res = doc;
          })
          .catch(err => {
            console.error("findUrl error:", err);
          })
        return res;
    },
    isCodeUnique: async (code) => {
        let res = await dbFunctions.findUrl(code);
        if (!res || res.length == 0) return true;
        return false;
    },
    getUniqueCode: async () => {
        let code, isUnique = false;
        while(!isUnique){
            code = dbFunctions.generateRandomCode();
            isUnique = await dbFunctions.isCodeUnique(code);
        }
        return code;
    },
    saveUrl: async (url) => {
        let shortUrl = await dbFunctions.getUniqueCode();
        let row = {original_url: url, short_url: shortUrl};
        
        let urlModel = new urlDBModel(row)
            
        await urlModel.save()
            .then(doc => {
                console.log(doc);
            })
            .catch(err => {
                console.error(err)
                row = { error: 'invalid url' };
            })
        return row;
    }
}

module.exports = dbFunctions;