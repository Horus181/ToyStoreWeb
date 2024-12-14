const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ProductModel = require('../models/ProductModel');
const CategoryModel = require('../models/CategoryModel');
const BrandModel = require('../models/BrandModel');

// Cấu hình Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads'); // Thư mục lưu file upload
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file theo thời gian
    }
});
const upload = multer({ storage: storage });

// Route hiển thị trang index sản phẩm với tìm kiếm
router.get('/', async (req, res) => {
    const { productname, brand, category } = req.query;

    let searchConditions = {};
    if (productname) {
        searchConditions.productname = { $regex: productname, $options: 'i' };
    }
    if (brand) {
        searchConditions.brand = brand;
    }
    if (category) {
        searchConditions.category = category;
    }

    try {
        const products = await ProductModel.find(searchConditions)
            .populate('brand', 'brandname')
            .populate('category', 'categoryname');
        const categories = await CategoryModel.find();
        const brands = await BrandModel.find();
        res.render('product/index', { products, categories, brands, search: req.query });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route hiển thị trang thêm sản phẩm
router.get('/add', async (req, res) => {
    try {
        const brands = await BrandModel.find();
        const categories = await CategoryModel.find();
        res.render('product/add', { brands, categories });
    } catch (error) {
        console.error('Error loading add page:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route thêm sản phẩm
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { productname, description, price, brand, category } = req.body;

        if (!productname || !price || !brand || !category) {
            return res.status(400).send('All fields are required.');
        }

        const newProduct = {
            productname: productname,
            description: description,
            price: price,
            brand: brand,
            category: category,
            image: req.file ? `/uploads/${req.file.filename}` : '/images/default-product.png'
        };

        await ProductModel.create(newProduct);
        res.redirect('/product');
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route hiển thị trang chỉnh sửa sản phẩm
router.get('/edit/:id', async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        const brands = await BrandModel.find();
        const categories = await CategoryModel.find();
        res.render('product/edit', { product, brands, categories });
    } catch (error) {
        console.error('Error loading edit page:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/edit/:id', upload.single('image'), async (req, res) => {
    try {
        const { productname, description, price, brand, category } = req.body;

        const updatedProduct = {
            productname: productname,
            description: description,
            price: price,
            brand: brand,
            category: category,
        };

        // Kiểm tra nếu có file upload
        if (req.file) {
            updatedProduct.image = `/uploads/${req.file.filename}`; // Cập nhật đường dẫn file ảnh mới
        }

        // Cập nhật sản phẩm trong database
        await ProductModel.findByIdAndUpdate(req.params.id, updatedProduct);
        res.redirect('/product');
    } catch (error) {
        console.error('Error editing product:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route xóa sản phẩm
router.get('/delete/:id', async (req, res) => {
    try {
        await ProductModel.findByIdAndDelete(req.params.id);
        res.redirect('/product');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
