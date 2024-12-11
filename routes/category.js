var express = require('express');
var router = express.Router();

var CategoryModel = require('../models/CategoryModel');
var ProductModel = require('../models/ProductModel');

router.get('/', async (req, res) => {
    var categories = await CategoryModel.find({});
    res.render('category/index', { categories });
})

router.get('/add', (req, res) => {
    res.render('category/add');
})

router.post('/add', async (req, res) => {
    var category = req.body;
    await CategoryModel.create(category);
    res.redirect('/category');
})

router.get('/detail/:id', async (req, res) => {
    var id = req.params.id;
    //SQL: SELECT * FROM mobiles WHERE brand = "id"
    var categories = await ProductModel.find({ category : id }).populate('category');
    res.render('category/detail', { categories })
})

router.get('/delete/:id', async (req, res) => {
    var id = req.params.id;
    var category = await CategoryModel.findById(id);
    await CategoryModel.deleteOne(category);
    res.redirect('/category');
})

router.get('/deleteall', async (req, res) => {
    await CategoryModel.deleteMany();
    console.log('Delete all category succeed !');
    res.redirect('/category');
})

router.get('/edit/:id', async (req, res) => {
    var id = req.params.id;
    var category = await CategoryModel.findById(id);
    res.render('category/edit', { category });
})

router.post('/edit/:id', async (req, res) => {
    var id = req.params.id;
    var category = req.body;
    try {
       await CategoryModel.findByIdAndUpdate(id, category);
       console.log('update succeed !');
    } catch (err) {
       console.log('update failed. Error: ' + err);
    }
    res.redirect('/category');
})

module.exports = router;