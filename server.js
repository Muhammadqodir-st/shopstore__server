const express = require('express');
const mongoDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const registerRoute = require('./router/userRouter');
const loginRouter = require('./router/authRouter');
const categoryRouter = require('./router/categoryRouter');
const app = express();

dotenv.config()

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

mongoDB()

app.use('/register', registerRoute);
app.use('/login', loginRouter);
app.use('/categories', categoryRouter);

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`${PORT} port listining`);
});