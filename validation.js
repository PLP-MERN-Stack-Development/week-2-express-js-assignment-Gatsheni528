const { ValidationError } = require('../errors/ValidationError');

const validateProduct = (req, res, next) => {
    const { name, description, price, category, inStock } = req.body;

    if (typeof name !== 'string' || name.trim() === '') {
        return next(new ValidationError('Name is required and must be a string.'));
    }
    if (typeof description !== 'string' || description.trim() === '') {
        return next(new ValidationError('Description is required and must be a string.'));
    }
    if (typeof price !== 'number' || price < 0) {
        return next(new ValidationError('Price must be a positive number.'));
    }
    if (typeof category !== 'string' || category.trim() === '') {
        return next(new ValidationError('Category is required and must be a string.'));
    }
    if (typeof inStock !== 'boolean') {
        return next(new ValidationError('inStock must be a boolean value.'));
    }

    next();
};

module.exports = { validateProduct };