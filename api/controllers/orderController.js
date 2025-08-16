const Order = require('../models/orderModel');
const Product = require('../models/productModel');

exports.getAllOrders = async (req, res) => {
  try {
    const docs = await Order.find()
      .select('product quantity _id')
      .populate('product', 'name');

    res.status(200).json({
      count: docs.length,
      orders: docs.map((doc) => ({
        _id: doc._id,
        product: doc.product,
        quantity: doc.quantity,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || err });
  }
};

exports.newOrder = async (req, res) => {
  try {
    const product = await Product.findById(req.body.prodId);
    if (!product) {
      return res.status(400).json({ message: 'Product not found' });
    }

    const order = new Order({
      quantity: req.body.quantity,
      product: req.body.prodId,
    });

    const result = await order.save();
    res.status(201).json({
      message: 'Order stored',
      createdOrder: {
        _id: result._id,
        product: result.product,
        quantity: result.quantity,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || err });
  }
};

exports.getOneOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || err });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || err });
  }
};
