import asyncHandler from 'express-async-handler';
import Application from '../models/applicationModel.js';

// @desc    Create a new application
// @route   POST /api/applications
// @access  Public
const createApplication = asyncHandler(async (req, res) => {
  const { name, gender, age, email, contact, description } = req.body;

  // Validate required fields
  if (!name || !gender || !age || !email || !contact || !description) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const application = await Application.create({
    name,
    gender,
    age,
    email,
    contact,
    description,
  });

  res.status(201).json(application);
});

// @desc    Get all applications (admin only)
// @route   GET /api/applications
// @access  Private/Admin
const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({});
  res.json(applications);
});

// @desc    Update application status (admin only)
// @route   PUT /api/applications/:id
// @access  Private/Admin
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  application.status = req.body.status || application.status;
  const updatedApplication = await application.save();
  res.json(updatedApplication);
});

// @desc    Delete application (admin only)
// @route   DELETE /api/applications/:id
// @access  Private/Admin
const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  await application.deleteOne();
  res.json({ message: 'Application removed' });
});

export {
  createApplication,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
}; 