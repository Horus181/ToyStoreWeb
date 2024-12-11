var express = require('express');
var router = express.Router();
var BrandModel = require('../models/BrandModel');
var CategoryModel = require('../models/CategoryModel');
const ProductModel = require('../models/ProductModel');

router.get('/', async (req, res) => {
    var products = await ProductModel.find({}).populate('brand').populate('category');
    res.render('product/index', { products });
});


router.get('/list', async (req, res) => {
    var products = await ProductModel.find({}).populate('brand');
    res.render('product/list', { products });
})

router.get('/add', async (req, res) => {
    var brands = await BrandModel.find({});
    var categories = await CategoryModel.find({});
    res.render('product/add', { brands, categories });
});


router.post('/add', async (req, res) => {
    var product = req.body;
    await ProductModel.create(product);
    res.redirect('/product');
})

router.get('/delete/:id', async (req, res) => {
    await ProductModel.findByIdAndDelete(req.params.id);
    res.redirect('/product');
})
 
 router.get('/edit/:id', async (req, res) => {
    var id = req.params.id;
    var product = await ProductModel.findById(id);
    var brands = await BrandModel.find({});
    var categories = await CategoryModel.find({});
    res.render('product/edit', { product, brands, categories });
})

router.post('/edit/:id', async (req, res) => {
    var id = req.params.id;
    var product = req.body;
    try {
       await ProductModel.findByIdAndUpdate(id, product);
       console.log('update succeed !');
    } catch (err) {
       console.log('update failed. Error: ' + err);
    }
    res.redirect('/product');
})

router.get('/sort/asc', async (req, res) => {
    var products = await ProductModel.find().populate('brand').sort({ model: 1 });
    res.render('product/index', { products })
})

router.get('/sort/desc', async (req, res) => {
    var products = await ProductModel.find().populate('brand').sort({ model: -1 });
    res.render('product/index', { products })
})

router.post('/search', async (req, res) => {
    var keyword = req.body.keyword;
    var products = await ProductModel.find({ model: new RegExp(keyword, "i") }).populate('brand').populate('brand');
    res.render('product/index', { products })
})

module.exports = router;
