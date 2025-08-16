const Product = require('../models/productModel');

exports.getAll = async (req, res) => {
  try {
    const docs = await Product.find().select('name price _id productImg');
    res.status(200).json({
      count: docs.length,
      products: docs.map((doc) => ({
        name: doc.name,
        price: doc.price,
        productImg: doc.productImg,
        _id: doc._id,
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${doc._id}`,
        },
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || err });
  }
};

exports.newProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      productImg: req.file.path,
    });

    const result = await product.save();
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || err });
  }
};

exports.getOne = async (req, res) => {
  try {
    const doc = await Product.findById(req.params.id).select(
      'name price _id productImg'
    );
    if (!doc) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || err });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || err });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || err });
  }
};
