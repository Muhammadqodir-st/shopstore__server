const mongoose = require('mongoose');

const mongoDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('connected mongodb'))
        .catch((err) => console.error(err))
};

module.exports = mongoDB;