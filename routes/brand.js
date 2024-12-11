var express = require('express');
var router = express.Router();
const BrandModel = require('../models/BrandModel');
var ProductModel = require('../models/ProductModel');

router.get('/', async (req, res) => {
    var brands = await BrandModel.find({});
    res.render('brand/index', { brands });
})

router.get('/add', (req, res) => {
    res.render('brand/add');
})

router.post('/add', async (req, res) => {
    var brand = req.body;
    await BrandModel.create(brand);
    res.redirect('/brand');
})

router.get('/detail/:id', async (req, res) => {
    var id = req.params.id;
    //SQL: SELECT * FROM mobiles WHERE brand = "id"
    var products = await ProductModel.find({ brand : id }).populate('brand');
    res.render('brand/detail', { products })
})

router.get('/delete/:id', async (req, res) => {
    var id = req.params.id;
    var brand = await BrandModel.findById(id);
    await BrandModel.deleteOne(brand);
 
    res.redirect('/brand');
})

router.get('/deleteall', async (req, res) => {
    await BrandModel.deleteMany();
    console.log('Delete all brand succeed !');
    res.redirect('/brand');
})

router.get('/edit/:id', async (req, res) => {
    var id = req.params.id;
    var brand = await BrandModel.findById(id);
    res.render('brand/edit', { brand });
})

router.post('/edit/:id', async (req, res) => {
    var id = req.params.id;
    var brand = req.body;
    try {
       await BrandModel.findByIdAndUpdate(id, brand);
       console.log('update succeed !');
    } catch (err) {
       console.log('update failed. Error: ' + err);
    }
    res.redirect('/brand');
})

module.exports = router;