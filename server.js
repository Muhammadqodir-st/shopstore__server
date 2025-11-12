const express = require('express');
const mongoDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');
const registerRoute = require('./router/userRouter');
const loginRouter = require('./router/authRouter');
const categoryRouter = require('./router/categoryRouter');
const productRouter = require('./router/productRouter');
const wishlistRoute = require('./router/wishlistRote');
const cartRoute = require('./router/cartRouter');
const orderRoute = require('./router/orderRouter');
const app = express();

dotenv.config()

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:3000', 'https://shopstore-com.vercel.app'],
    credentials: true
}))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

mongoDB();

app.use('/register', registerRoute);
app.use('/login', loginRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/wishlists', wishlistRoute);
app.use('/carts', cartRoute);
app.use('/orders', orderRoute);

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`${PORT} port listining`);
}); 