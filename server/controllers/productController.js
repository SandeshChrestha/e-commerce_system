import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  // Upload image to Cloudinary if image is provided
  let imageUrl = image;
  if (image && image.startsWith('data:image')) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'products',
        resource_type: 'auto',
      });
      imageUrl = uploadResponse.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(400);
      throw new Error('Failed to upload image');
    }
  }

  const product = new Product({
    name,
    price,
    user: req.user._id,
    image: imageUrl,
    brand,
    category,
    countInStock,
    description,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    const {
      name,
      price,
      description,
      image,
      brand,
      category,
      countInStock,
    } = req.body;

    // Handle image upload if new image is provided
    let imageUrl = product.image;
    if (image && image !== product.image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: 'products',
        });
        imageUrl = uploadResponse.secure_url;
      } catch (error) {
        res.status(400);
        throw new Error('Failed to upload image');
      }
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = imageUrl;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Delete image from Cloudinary if it exists
    if (product.image) {
      try {
        const publicId = product.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
      }
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
}); 