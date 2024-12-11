const mongoose = require('mongoose');

// Định nghĩa schema cho sản phẩm
const ProductSchema = new mongoose.Schema({
    productname: {
        type: String,
        required: [true, 'Product name is required'], // Thông báo lỗi nếu thiếu
        trim: true // Loại bỏ khoảng trắng đầu/cuối chuỗi
    },
    description: {
        type: String,
        default: 'No description available' // Giá trị mặc định nếu không được cung cấp
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number'] // Giá trị tối thiểu
    },
    image: {
        type: String,
        default: '/images/default-product.png' // Hình ảnh mặc định nếu không cung cấp
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brands', // Tên model phải khớp với tên trong mongoose.model()
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories', // Tên model của danh mục
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Tự động lưu ngày tạo sản phẩm
    },
    updatedAt: {
        type: Date,
        default: Date.now // Tự động lưu ngày cập nhật
    }
});

// Middleware cập nhật `updatedAt` khi có thay đổi
ProductSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

ProductSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

// Tạo index cho tìm kiếm text
ProductSchema.index({ productname: 'text' });

// Tạo model từ schema
const ProductModel = mongoose.model('products', ProductSchema);

module.exports = ProductModel;
