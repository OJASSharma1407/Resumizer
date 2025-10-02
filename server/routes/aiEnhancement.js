require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { CohereClient } = require('cohere-ai');

const cohere = new CohereClient({
  token: process.env.api_key,
});

// AI Resume Analysis and Feedback
router.post('/analyze-resume', fetchuser, async (req, res) => {
  try {
    const { resumeContent } = req.body;

    if (!resumeContent) {
      return res.status(400).json({ error: "Resume content is required" });
    }

    const prompt = `
You are an expert resume reviewer and career coach. Analyze the following resume and provide detailed, actionable feedback.

🎯 ANALYSIS FRAMEWORK:
1. **ATS Compatibility** - How well will this pass Applicant Tracking Systems?
2. **Content Quality** - Strength of achievements, skills, and descriptions
3. **Structure & Format** - Organization, readability, and professional appearance
4. **Keyword Optimization** - Industry-relevant terms and phrases
5. **Impact & Quantification** - Use of metrics and measurable results

📋 RESUME TO ANALYZE:
${resumeContent}

🔍 PROVIDE FEEDBACK IN THIS FORMAT:

**OVERALL SCORE: X/10**

**STRENGTHS:**
• [List 3-4 key strengths]

**AREAS FOR IMPROVEMENT:**
• [List 3-4 specific improvements needed]

**ATS OPTIMIZATION:**
• [Specific suggestions for ATS compatibility]

**CONTENT ENHANCEMENT:**
• [Suggestions for better descriptions and achievements]

**KEYWORD RECOMMENDATIONS:**
• [Industry-specific keywords to add]

**ACTION ITEMS:**
1. [Specific actionable step]
2. [Specific actionable step]
3. [Specific actionable step]

⚠️ OUTPUT ONLY THE STRUCTURED FEEDBACK - NO EXTRA TEXT
`;

    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt,
      max_tokens: 1500,
      temperature: 0.2
    });

    const feedback = response.generations?.[0]?.text?.trim();

    if (!feedback) {
      return res.status(500).json({ error: "AI failed to generate feedback" });
    }

    res.status(200).json({ success: true, feedback });

  } catch (err) {
    console.error("Resume Analysis Error:", err);
    res.status(500).json({ error: "Server error during resume analysis" });
  }
});

// AI Job Description Matching
router.post('/match-job', fetchuser, async (req, res) => {
  try {
    const { resumeContent, jobDescription } = req.body;

    if (!resumeContent || !jobDescription) {
      return res.status(400).json({ error: "Resume content and job description are required" });
    }

    const prompt = `
You are an AI career advisor specializing in job-resume matching. Analyze how well this resume matches the job requirements.

🎯 MATCHING ANALYSIS:

**JOB DESCRIPTION:**
${jobDescription}

**CANDIDATE RESUME:**
${resumeContent}

📊 PROVIDE ANALYSIS IN THIS FORMAT:

**MATCH SCORE: X/10**

**MATCHING QUALIFICATIONS:**
• [List skills/experience that match]

**MISSING REQUIREMENTS:**
• [List what's missing from resume]

**RESUME OPTIMIZATION SUGGESTIONS:**
• [Specific changes to better match this job]

**COVER LETTER FOCUS POINTS:**
• [Key points to emphasize in cover letter]

**INTERVIEW PREPARATION:**
• [Areas to prepare for based on gaps]

**RECOMMENDED ACTIONS:**
1. [Specific step to improve match]
2. [Specific step to improve match]
3. [Specific step to improve match]

⚠️ OUTPUT ONLY THE STRUCTURED ANALYSIS - NO EXTRA TEXT
`;

    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt,
      max_tokens: 1200,
      temperature: 0.3
    });

    const analysis = response.generations?.[0]?.text?.trim();

    if (!analysis) {
      return res.status(500).json({ error: "AI failed to generate job matching analysis" });
    }

    res.status(200).json({ success: true, analysis });

  } catch (err) {
    console.error("Job Matching Error:", err);
    res.status(500).json({ error: "Server error during job matching analysis" });
  }
});

// AI Skills Gap Analysis
router.post('/skills-gap', fetchuser, async (req, res) => {
  try {
    const { currentSkills, targetRole, industry } = req.body;

    if (!currentSkills || !targetRole) {
      return res.status(400).json({ error: "Current skills and target role are required" });
    }

    const prompt = `
You are a career development expert. Analyze the skills gap for career advancement.

🎯 SKILLS GAP ANALYSIS:

**CURRENT SKILLS:**
${Array.isArray(currentSkills) ? currentSkills.join(', ') : currentSkills}

**TARGET ROLE:**
${targetRole}

**INDUSTRY:**
${industry || 'General'}

📈 PROVIDE ANALYSIS IN THIS FORMAT:

**CAREER READINESS: X/10**

**SKILLS ALIGNMENT:**
• [Skills that match target role]

**CRITICAL GAPS:**
• [Most important missing skills]

**LEARNING ROADMAP:**
1. **Immediate (1-3 months):** [Skills to learn first]
2. **Short-term (3-6 months):** [Next priority skills]
3. **Long-term (6-12 months):** [Advanced skills for growth]

**RECOMMENDED RESOURCES:**
• [Specific courses, certifications, or platforms]

**PORTFOLIO PROJECTS:**
• [Project ideas to demonstrate new skills]

**NETWORKING FOCUS:**
• [Professional communities and events to join]

⚠️ OUTPUT ONLY THE STRUCTURED ROADMAP - NO EXTRA TEXT
`;

    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt,
      max_tokens: 1000,
      temperature: 0.4
    });

    const roadmap = response.generations?.[0]?.text?.trim();

    if (!roadmap) {
      return res.status(500).json({ error: "AI failed to generate skills roadmap" });
    }

    res.status(200).json({ success: true, roadmap });

  } catch (err) {
    console.error("Skills Gap Analysis Error:", err);
    res.status(500).json({ error: "Server error during skills gap analysis" });
  }
});

module.exports = router;