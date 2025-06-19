const express = require('express');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');
const { NotFoundError } = require('../errors/NotFoundError');
const router = express.Router();

let products = [];

router.get('/', (req, res) => {
    let { category, search, page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    let filteredProducts = products;
    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchLower));
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
        total: filteredProducts.length,
        page,
        limit,
        data: paginatedProducts
    });
});

router.get('/stats', (req, res) => {
    const stats = {};
    products.forEach(product => {
        const cat = product.category;
        if (!stats[cat]) stats[cat] = 0;
        stats[cat]++;
    });
    res.json(stats);
});

router.get('/:id', (req, res, next) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return next(new NotFoundError('Product not found'));
    res.json(product);
});

router.post('/', auth, validateProduct, (req, res) => {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = { id: uuidv4(), name, description, price, category, inStock };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

router.put('/:id', auth, validateProduct, (req, res, next) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return next(new NotFoundError('Product not found'));
    const { name, description, price, category, inStock } = req.body;
    products[index] = { ...products[index], name, description, price, category, inStock };
    res.json(products[index]);
});

router.delete('/:id', auth, (req, res, next) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return next(new NotFoundError('Product not found'));
    const deletedProduct = products.splice(index, 1);
    res.json({ message: 'Product deleted', product: deletedProduct[0] });
});

module.exports = router;