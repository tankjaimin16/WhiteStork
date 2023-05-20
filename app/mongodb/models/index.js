const fs = require('fs');

module.exports = () => {
    fs.readdirSync(__dirname).forEach((file) => {
        if (file == "index.js")
            return;
        let name = file.substr(0, file.lastIndexOf('.'));
        require('./' + name);
    });
}


 