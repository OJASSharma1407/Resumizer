require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const CoverLetter = require('../models/CoverLetter');
const PDFDocument = require('pdfkit');
const { CohereClient } = require('cohere-ai');

const cohere = new CohereClient({
  token: process.env.api_key,
});


//-------Cover Letter Route-------//
router.post('/create-cover-letter', fetchuser, async (req, res) => {
  const { personalInfo, description } = req.body;

  // Validate input
  if (!personalInfo || !description) {
    return res.status(400).json({ error: "Missing personalInfo or description" });
  }

  try {
    const newCoverLetter = new CoverLetter({
      user: req.user.id,
      personalInfo,
      description
    });

    const saved = await newCoverLetter.save();
    res.status(201).json({ success: true, message: "Cover letter entry created", id: saved._id });
  } catch (err) {
    console.error("Create Entry Error:", err);
    res.status(500).json({ error: "Server error while saving cover letter entry." });
  }
});


//--------get coverletter Response------//
router.post('/generate-cover-letter/:id', fetchuser, async (req, res) => {
  const coverLetterId = req.params.id;

  try {
    const existing = await CoverLetter.findOne({ _id: coverLetterId, user: req.user.id });

    if (!existing) {
      return res.status(404).json({ error: "Cover letter entry not found" });
    }

    const { personalInfo, description } = existing;

   const prompt = `
You are an expert cover letter writer specializing in creating compelling, personalized cover letters that get results.

🎯 MISSION: Create a professional, engaging cover letter that:
- Captures the hiring manager's attention immediately
- Demonstrates genuine interest and research about the role/company
- Highlights the candidate's most relevant qualifications
- Shows personality while maintaining professionalism
- Includes a strong call-to-action

📋 FORMAT REQUIREMENTS:
- Start with today's date
- Professional greeting ("Dear Hiring Manager" or specific name if provided)
- 3-4 compelling paragraphs with clear structure:
  1. Opening hook + position interest
  2. Relevant experience + key achievements
  3. Skills alignment + value proposition
  4. Strong closing + next steps
- Professional sign-off with full name
- NO extra commentary or explanations

👤 CANDIDATE PROFILE:
Name: ${personalInfo.fullName}
Email: ${personalInfo.email}
Phone: ${personalInfo.phone}
GitHub: ${personalInfo.github || 'Not provided'}
LinkedIn: ${personalInfo.linkedIn || 'Not provided'}

💼 ROLE & REQUIREMENTS:
${description}

🚀 ENHANCEMENT GUIDELINES:
- Use specific examples and quantifiable achievements
- Match language and keywords from the job description
- Show enthusiasm and cultural fit
- Demonstrate research about the company/role
- Keep tone confident but not arrogant
- Ensure ATS-friendly formatting

⚠️ OUTPUT ONLY THE COMPLETE COVER LETTER
`;

    const response = await cohere.chat({
      model: 'command-r',
      message: prompt,
      max_tokens: 1000,
      temperature: 0.4
    });

    const generatedLetter = response.text?.trim();

    if (!generatedLetter) {
      return res.status(500).json({ error: "AI failed to generate the cover letter." });
    }

    // Update document with the generated cover letter
    existing.coverletter = generatedLetter;
    await existing.save();

    res.status(200).json({ success: true, coverletter: generatedLetter });

  } catch (err) {
    console.error("Generate Cover Letter Error:", err);
    res.status(500).json({ error: "Server error during AI generation." });
  }
});

// Get a cover letter by ID (for frontend display)
router.get('/get-cover-letters', fetchuser, async (req, res) => {
  const userId = req.user.id;
  try {
    const coverLetters = await CoverLetter.find({user:userId});
    if (!coverLetters) {
      return res.status(404).json({ success: false, error: "Cover letter not found" });
    }
    res.status(200).json({ success: true, coverLetters });
  } catch (err) {
    console.error("Get Cover Letter Error:", err);
    res.status(500).json({ success: false, error: "Server error while fetching cover letter" });
  }
});

// Edit (update) a cover letter by ID
router.put('/edit-cover-letter/:id', fetchuser, async (req, res) => {
  const { personalInfo, description } = req.body;
  try {
    const coverLetter = await CoverLetter.findOne({ _id: req.params.id, user: req.user.id });
    if (!coverLetter) {
      return res.status(404).json({ success: false, error: "Cover letter not found" });
    }
    if (personalInfo) coverLetter.personalInfo = personalInfo;
    if (description) coverLetter.description = description;
    await coverLetter.save();
    res.status(200).json({ success: true, message: "Cover letter updated successfully", coverLetter });
  } catch (err) {
    console.error("Edit Cover Letter Error:", err);
    res.status(500).json({ success: false, error: "Server error while editing cover letter" });
  }
});

// Delete a cover letter by ID
router.delete('/delete-cover-letter/:id', fetchuser, async (req, res) => {
  try {
    const coverLetter = await CoverLetter.findOne({ _id: req.params.id, user: req.user.id });
    if (!coverLetter) {
      return res.status(404).json({ success: false, error: "Cover letter not found" });
    }
    await coverLetter.deleteOne();
    res.status(200).json({ success: true, message: "Cover letter deleted successfully" });
  } catch (err) {
    console.error("Delete Cover Letter Error:", err);
    res.status(500).json({ success: false, error: "Server error while deleting cover letter" });
  }
});


// ✅ API: Remove only the "coverletter" field
router.put("/remove-coverletter/:id", fetchuser, async (req, res) => {
  try {
    const { id } = req.params;

    // Find cover letter belonging to logged-in user
    let coverLetter = await CoverLetter.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!coverLetter) {
      return res.status(404).json({ success: false, error: "Cover letter not found" });
    }

    // Remove only the coverletter field
    coverLetter.coverletter = undefined;

    await coverLetter.save();

    res.json({
      success: true,
      message: "Cover letter content removed, but record kept",
      coverLetter,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

//-------Get-Ai-CoverLetter----------//
router.get('/view-ai-coverLetter/:id', fetchuser, async (req, res) => {
  const letterId = req.params.id;
  const userId = req.user.id;

  try {
    const AIletter = await CoverLetter.findOne({ user: userId, _id: letterId });

    if (!AIletter) {
      return res.status(404).json({ success: false, error: "Cover letter not found" });
    }

    res.status(200).json({ success: true, coverLetter: AIletter });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ success: false, error: "Server error while fetching cover letter" });
  }
});

//-------Download CoverLetter--------//
router.get('/download-cover-letter/:id', fetchuser, async (req, res) => {
  try {
    const coverL = await CoverLetter.findById(req.params.id);

    if (!coverL) {
      return res.status(404).json({ success: false, error: "Cover letter not found" });
    }

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cover-letter.pdf');

    doc.pipe(res);
    doc.fontSize(12).text(coverL.coverletter || 'No content found');
    doc.end();

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Server error while downloading coverLetter" });
  }
});

module.exports = router;