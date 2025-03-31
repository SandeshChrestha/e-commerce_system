import asyncHandler from 'express-async-handler';
import FutsalCourt from '../models/futsalCourtModel.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get all futsal courts
// @route   GET /api/futsal-courts
// @access  Private
export const getCourts = asyncHandler(async (req, res) => {
  const courts = await FutsalCourt.find({});
  res.json(courts);
});

// @desc    Get single futsal court
// @route   GET /api/futsal-courts/:id
// @access  Private
export const getCourtById = asyncHandler(async (req, res) => {
  const court = await FutsalCourt.findById(req.params.id);
  if (court) {
    res.json(court);
  } else {
    res.status(404);
    throw new Error('Court not found');
  }
});

// @desc    Create a futsal court
// @route   POST /api/futsal-courts
// @access  Private/Admin
export const createCourt = asyncHandler(async (req, res) => {
  const {
    name,
    type,
    pricePerHour,
    description,
    facilities,
    openingTime,
    closingTime,
    availableDays,
    image,
  } = req.body;

  // Validate required fields
  if (!name || !type || !pricePerHour || !description || !openingTime || !closingTime) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  // Validate court type
  if (!['Indoor', 'Outdoor', 'Premium'].includes(type)) {
    res.status(400);
    throw new Error('Invalid court type');
  }

  // Validate price
  if (pricePerHour <= 0) {
    res.status(400);
    throw new Error('Price must be greater than 0');
  }

  // Upload image to Cloudinary if image is provided
  let imageUrl = '/images/default-court.jpg';
  if (image && image.startsWith('data:image')) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'futsal-courts',
        resource_type: 'auto',
      });
      imageUrl = uploadResponse.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(400);
      throw new Error('Failed to upload image');
    }
  }

  // Create court with validated data
  const court = new FutsalCourt({
    name,
    type,
    pricePerHour,
    description,
    facilities: Array.isArray(facilities) ? facilities : [],
    openingTime,
    closingTime,
    availableDays: Array.isArray(availableDays) ? availableDays : [],
    image: imageUrl,
  });

  const createdCourt = await court.save();
  res.status(201).json(createdCourt);
});

// @desc    Update a futsal court
// @route   PUT /api/futsal-courts/:id
// @access  Private/Admin
export const updateCourt = asyncHandler(async (req, res) => {
  const court = await FutsalCourt.findById(req.params.id);

  if (court) {
    const {
      name,
      type,
      pricePerHour,
      description,
      facilities,
      openingTime,
      closingTime,
      availableDays,
      image,
    } = req.body;

    // Validate court type if provided
    if (type && !['Indoor', 'Outdoor', 'Premium'].includes(type)) {
      res.status(400);
      throw new Error('Invalid court type');
    }

    // Validate price if provided
    if (pricePerHour && pricePerHour <= 0) {
      res.status(400);
      throw new Error('Price must be greater than 0');
    }

    // Handle image upload if new image is provided
    let imageUrl = court.image;
    if (image && image !== court.image) {
      try {
        // Delete old image from Cloudinary if it exists
        if (court.image && !court.image.startsWith('/images/')) {
          const publicId = court.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`futsal-courts/${publicId}`);
        }

        // Upload new image
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: 'futsal-courts',
          resource_type: 'auto',
        });
        imageUrl = uploadResponse.secure_url;
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(400);
        throw new Error('Failed to upload image');
      }
    }

    court.name = name || court.name;
    court.type = type || court.type;
    court.pricePerHour = pricePerHour || court.pricePerHour;
    court.description = description || court.description;
    court.facilities = Array.isArray(facilities) ? facilities : court.facilities;
    court.openingTime = openingTime || court.openingTime;
    court.closingTime = closingTime || court.closingTime;
    court.availableDays = Array.isArray(availableDays) ? availableDays : court.availableDays;
    court.image = imageUrl;

    const updatedCourt = await court.save();
    res.json(updatedCourt);
  } else {
    res.status(404);
    throw new Error('Court not found');
  }
});

// @desc    Delete a futsal court
// @route   DELETE /api/futsal-courts/:id
// @access  Private/Admin
export const deleteCourt = asyncHandler(async (req, res) => {
  const court = await FutsalCourt.findById(req.params.id);

  if (court) {
    // Delete image from Cloudinary if it exists
    if (court.image && !court.image.startsWith('/images/')) {
      try {
        const publicId = court.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`futsal-courts/${publicId}`);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
      }
    }

    await court.deleteOne();
    res.json({ message: 'Court removed' });
  } else {
    res.status(404);
    throw new Error('Court not found');
  }
}); 