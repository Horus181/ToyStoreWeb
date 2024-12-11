const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Kết nối MongoDB
mongoose.connect('mongodb+srv://KinStore:admin@kinstore.dw2ms.mongodb.net/ToyStore')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Cấu hình view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Định tuyến (routes)
const indexRouter = require('./routes/index');
//const userRouter = require('./routes/user');
const brandRouter = require('./routes/brand');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/product');

// Sử dụng các routes
app.use('/', indexRouter);
//app.use('/user', userRouter);
app.use('/brand', brandRouter);
app.use('/category', categoryRouter);
app.use('/product', productRouter);

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).render('error', { title: '404 - Page Not Found' });
});

// Lắng nghe trên cổng 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
