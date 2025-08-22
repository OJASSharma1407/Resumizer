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
You are a professional cover letter writing assistant. Generate a **one-page, well-formatted, formal cover letter** based on the candidate's details and description below.

🔥 STRICT RULES:
- ONLY return the cover letter — NO extra text, instructions, or commentary.
- Start with the current date and a formal greeting (e.g., "Dear Hiring Manager" or based on company if known).
- Use the candidate's name, contact information, and description to tailor the letter.
- Highlight relevant skills, education, and projects that align with the job.
- End with a strong closing paragraph and a professional sign-off (e.g., "Sincerely, [Full Name]").
- Use clear formatting, line breaks between paragraphs, and keep the tone formal yet enthusiastic.
- Make sure it sounds like it's written by a real person.

🧾 CANDIDATE INFORMATION:
Full Name: ${personalInfo.fullName}
Email: ${personalInfo.email}
Phone: ${personalInfo.phone}
GitHub: ${personalInfo.github}
LinkedIn: ${personalInfo.linkedIn}

📄 JOB DESCRIPTION / CANDIDATE SUMMARY:
${description}
`;

    const response = await cohere.generate({
      model: 'command',
      prompt,
      max_tokens: 800,
      temperature: 0.7
    });

    const generatedLetter = response.generations?.[0]?.text?.trim();

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

module.exports = router;


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
    const coverL = await CoverLetter.findById(req.params.id );

    if (!coverL) {
      return res.status(404).json({ success: false, error: "Refined resume not found" });
    }

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=refined-resume.pdf');

    doc.pipe(res);
    doc.fontSize(12).text(coverL.coverletter || 'No content found');
    doc.end();

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: "Server error while downloading coverLetter" });
  }
});

module.exports = router;