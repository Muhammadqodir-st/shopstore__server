const express = require('express');
const mongoDB = require('./config/db');
const dotenv = require('dotenv');
const registerRoute = require('./router/userRouter')


dotenv.config()

const app = express();
app.use(express.json())

mongoDB()

app.use('/regiter', registerRoute);

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`${PORT} port listining`);
})