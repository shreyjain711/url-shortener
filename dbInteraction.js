let urlDBModel = require('./models/urlDB');

const dbFunctions = {
    generateRandomCode: () => {
        let val = "";
        while(val.length < 6) {
            val += String.fromCharCode(97 + Math.floor(Math.random()*26));
        }
        return val;
    },
    findUrl: (code) => {
        let res;
        urlDBModel.find({
            shortUrl: code   // search query
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
    isCodeUnique: (code) => {
        let res = dbFunctions.findUrl(code);
        if (!res || res.length == 0) return true;
        return false;
    },
    getUniqueCode: () => {
        let code, isUnique = false;
        while(!isUnique){
            code = dbFunctions.generateRandomCode();
            isUnique = dbFunctions.isCodeUnique(code);
        }
        return code;
    },
    saveUrl: (url) => {
        let shortUrl = dbFunctions.getUniqueCode();
        let row = {original_url: url, short_url: shortUrl};
        
        let urlModel = new urlDBModel(row)
            
        urlModel.save()
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