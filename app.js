const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const hbs = require('hbs');
const bodyParser = require('body-parser');
// Khởi tạo ứng dụng Express
const app = express();

// Kết nối MongoDB
mongoose.connect('mongodb+srv://KinStore:admin@kinstore.dw2ms.mongodb.net/ToyStore', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Cấu hình view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Đăng ký helper Handlebars
hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Định tuyến (routes)
const productRouter = require('./routes/product'); // Route sản phẩm
const brandRouter = require('./routes/brand');     // Route thương hiệu
const categoryRouter = require('./routes/category'); // Route danh mục

// Gắn tiền tố cho các route
app.use('/product', productRouter);
app.use('/brand', brandRouter);
app.use('/category', categoryRouter);

// Trang chính (index)
app.get('/', (req, res) => {
    res.render('dashboard', { title: 'Toy Store Dashboard' }); // File dashboard.hbs
});

// Xử lý lỗi 404 (Route không tìm thấy)
app.use((req, res) => {
    res.status(404).render('error', { title: '404 - Page Not Found' });
});

// Lắng nghe trên cổng 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
