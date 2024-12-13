const express = require('express');
const router = express.Router();
const ProductModel = require('../models/ProductModel');
const CategoryModel = require('../models/CategoryModel');
const BrandModel = require('../models/BrandModel');

// Route hiển thị trang index sản phẩm với tìm kiếm
router.get('/', async (req, res) => {
    const { productname, brand, category } = req.query;

    let searchConditions = {};
    if (productname) {
        searchConditions.productname = { $regex: productname, $options: 'i' }; // Tìm kiếm không phân biệt hoa thường
    }
    if (brand) {
        searchConditions.brand = brand; // Tìm theo brand ID
    }
    if (category) {
        searchConditions.category = category; // Tìm theo category ID
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

// Route hiển thị danh sách sản phẩm (không tìm kiếm)
router.get('/list', async (req, res) => {
    try {
        const products = await ProductModel.find().populate('brand').populate('category');
        res.render('product/list', { products });
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
router.post('/add', async (req, res) => {
    try {
        const product = req.body;
        await ProductModel.create(product);
        res.redirect('/product');
    } catch (error) {
        console.error('Error adding product:', error);
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

// Route chỉnh sửa sản phẩm
router.post('/edit/:id', async (req, res) => {
    try {
        const product = req.body;
        await ProductModel.findByIdAndUpdate(req.params.id, product);
        res.redirect('/product');
    } catch (error) {
        console.error('Error editing product:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route sắp xếp sản phẩm tăng dần
router.get('/sort/asc', async (req, res) => {
    try {
        const products = await ProductModel.find().populate('brand').sort({ productname: 1 });
        res.render('product/index', { products });
    } catch (error) {
        console.error('Error sorting products:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route sắp xếp sản phẩm giảm dần
router.get('/sort/desc', async (req, res) => {
    try {
        const products = await ProductModel.find().populate('brand').sort({ productname: -1 });
        res.render('product/index', { products });
    } catch (error) {
        console.error('Error sorting products:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
