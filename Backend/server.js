const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://raki:1234@cluster0.rl8hm.mongodb.net/products', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    w: 'majority',
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


app.post('/api/products', async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        console.log('Product added:', savedProduct);
        res.status(201).json(savedProduct);
    } catch (err) {
        console.error('Error saving product:', err);
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log('Product updated:', updatedProduct);
        res.json(updatedProduct);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(400).json({ message: err.message });
    }
});


app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        console.log('Products retrieved:', products);
        res.json(products);
    } catch (err) {
        console.error('Error retrieving products:', err);
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error('Error retrieving product:', err);
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/products', async (req, res) => {
    try {
        await Product.deleteMany({}, { writeConcern: { w: 'majority' } }); // Explicit write concern
        console.log('All products deleted');
        res.json({ message: 'All products deleted successfully' });
    } catch (err) {
        console.error('Error deleting products:', err);
        res.status(500).json({ message: 'Error deleting products' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});