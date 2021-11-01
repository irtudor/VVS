const {promises: fs} = require('fs');
const DATABASE_NAME = 'database.json'

const getDatabase = async () => {
    const file = await fs.readFile(DATABASE_NAME, 'utf8');
    return JSON.parse(file);
}

const saveDatabase = (database) => {
    const strDB = JSON.stringify(database); //convert it back to json
    return fs.writeFile(DATABASE_NAME, strDB, 'utf8');
};

module.exports = {
    getDatabase: getDatabase,
    saveDatabase: saveDatabase
}