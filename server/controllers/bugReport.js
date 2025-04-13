
const BugReport = require('../models/BugReport');
const nodemailer = require('nodemailer');

// @desc    Create new bug report
// @route   POST /api/bug-reports
// @access  Public
exports.createBugReport = async (req, res) => {
  try {
    const bugReport = await BugReport.create(req.body);
    
    res.status(201).json({
      success: true,
      data: bugReport
    });
  } catch (err) {
    console.error('Error creating bug report:', err);
    res.status(400).json({
      success: false,
      message: err.message || 'Failed to create bug report'
    });
  }
};

// @desc    Get all bug reports
// @route   GET /api/bug-reports
// @access  Private/Admin
exports.getBugReports = async (req, res) => {
  try {
    const bugReports = await BugReport.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: bugReports.length,
      data: bugReports
    });
  } catch (err) {
    console.error('Error fetching bug reports:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single bug report
// @route   GET /api/bug-reports/:id
// @access  Private/Admin
exports.getBugReport = async (req, res) => {
  try {
    const bugReport = await BugReport.findById(req.params.id);
    
    if (!bugReport) {
      return res.status(404).json({
        success: false,
        message: 'Bug report not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: bugReport
    });
  } catch (err) {
    console.error('Error fetching bug report:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update bug report status
// @route   PUT /api/bug-reports/:id/status
// @access  Private/Admin
exports.updateBugStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a status'
      });
    }
    
    const updateData = {
      status
    };
    
    // If status is resolved, add resolved date
    if (status === 'resolved') {
      updateData.resolvedAt = Date.now();
    }
    
    const bugReport = await BugReport.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!bugReport) {
      return res.status(404).json({
        success: false,
        message: 'Bug report not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: bugReport
    });
  } catch (err) {
    console.error('Error updating bug status:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Add note to bug report
// @route   POST /api/bug-reports/:id/notes
// @access  Private/Admin
exports.addBugNote = async (req, res) => {
  try {
    const { note } = req.body;
    
    if (!note) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a note'
      });
    }
    
    const bugReport = await BugReport.findById(req.params.id);
    
    if (!bugReport) {
      return res.status(404).json({
        success: false,
        message: 'Bug report not found'
      });
    }
    
    // Append new note to existing notes
    const updatedNotes = bugReport.notes 
      ? `${bugReport.notes}\n\n${new Date().toISOString()}: ${note}`
      : `${new Date().toISOString()}: ${note}`;
    
    const updatedBugReport = await BugReport.findByIdAndUpdate(
      req.params.id,
      { notes: updatedNotes },
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      data: updatedBugReport
    });
  } catch (err) {
    console.error('Error adding bug note:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Send email response to bug reporter
// @route   POST /api/bug-reports/:id/respond
// @access  Private/Admin
exports.respondToBugReport = async (req, res) => {
  try {
    const { message, markAsResolved } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message'
      });
    }
    
    const bugReport = await BugReport.findById(req.params.id);
    
    if (!bugReport) {
      return res.status(404).json({
        success: false,
        message: 'Bug report not found'
      });
    }
    
    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    
    // Send email
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM || 'ClickProp Support'}" <${process.env.SMTP_USER}>`,
      to: bugReport.reporterEmail,
      subject: `Re: Bug Report - ${bugReport.title}`,
      text: message,
    });
    
    // If markAsResolved is true, update bug status
    if (markAsResolved) {
      bugReport.status = 'resolved';
      bugReport.resolvedAt = Date.now();
      await bugReport.save();
    }
    
    // Add response as a note
    const updatedNotes = bugReport.notes 
      ? `${bugReport.notes}\n\n${new Date().toISOString()} - Email Response: ${message}`
      : `${new Date().toISOString()} - Email Response: ${message}`;
    
    bugReport.notes = updatedNotes;
    await bugReport.save();
    
    res.status(200).json({
      success: true,
      data: bugReport
    });
  } catch (err) {
    console.error('Error responding to bug report:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to send response',
      error: err.message
    });
  }
};
