const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const productRouter = require('./routes/productRouter');
const userRouter = require('./routes/userRouter');
const orderRouter = require('./routes/orderRouter');
const categoryRouter = require('./routes/categoryRouter');
const { authJwt } = require('./helpers/jwt');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./helpers/appError');

const app = express();

require('dotenv/config');
const api = process.env.API_URL;

// CORS
app.use(cors());
app.options('*', cors());
//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

app.use(`${api}/products`, productRouter);
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/categories`, categoryRouter);
app.use('*', (req, res, next) => {
  next(
    new AppError(`Can't find this url ${req.originalUrl} on the server`, 404)
  );
});

app.use(globalErrorHandler);

// DATABASE CONNECTION
mongoose
  .connect(process.env.DATABASE)
  .then((con) => console.log('Database connected...'))
  .catch((err) => console.log(err));

// SERVER
app.listen(3000, () => {
  console.log('Server is running on http://127.0.0.1:3000');
});
