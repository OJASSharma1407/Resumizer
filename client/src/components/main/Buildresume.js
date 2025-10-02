import React, { useState } from "react";

export default function AddResume() {
  const Api = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    personalInfo: { name: "", email: "", phone: "", github: "", linkedIn: "" },
    careerObjective: "",
    skills: [""],
    techStack: [""],
    workExperience: [{ role: "", duration: "", company: "", description: "" }],
    projects: [{ title: "", description: "", link: "" }],
    education: [{ degree: "", fieldOfStudy: "", institution: "", startYear: "", endYear: "" }],
  });
  const [message, setMessage] = useState("");
  
  // Handle input changes for arrays or objects
  const handleChange = (section, field, value, index = null) => {
    if (Array.isArray(formData[section])) {
      const updated = [...formData[section]];
      if (typeof updated[index] === "string") {
        updated[index] = value;
      } else {
        updated[index][field] = value;
      }
      setFormData((prev) => ({ ...prev, [section]: updated }));
    } else if (typeof formData[section] === "object") {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [section]: value }));
    }
  };

  // Add new entry to array fields
  const addField = (section, newItem) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  // Submit data to backend
const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    personalInfo: {
      name: formData.personalInfo.name || "",
      email: formData.personalInfo.email || "",
      phone: formData.personalInfo.phone || "",
      github: formData.personalInfo.github || "",
      linkedIn: formData.personalInfo.linkedIn || ""
    },
    careerObjective: formData.careerObjective || "",
    skills: Array.isArray(formData.skills) ? formData.skills.filter(s => s.trim() !== "") : [],
    techStack: Array.isArray(formData.techStack) ? formData.techStack.filter(s => s.trim() !== "") : [],
    workExperience: Array.isArray(formData.workExperience)
      ? formData.workExperience.map(exp => ({
          role: exp.role || "",
          duration: exp.duration || "",
          company: exp.company || "",
          description: exp.description || ""
        }))
      : [],
    projects: Array.isArray(formData.projects)
      ? formData.projects.map(proj => ({
          title: proj.title || "",
          description: proj.description || "",
          link: proj.link || ""
        }))
      : [],
    education: Array.isArray(formData.education)
      ? formData.education.map(edu => ({
          degree: edu.degree || "",
          fieldOfStudy: edu.fieldOfStudy || "",
          institution: edu.institution || "",
          startYear: edu.startYear || "",
          endYear: edu.endYear || ""
        }))
      : []
  };

  console.log("Payload being sent:", payload); // Debug

  try {
    const res = await fetch(`${Api}/resume/add-resume-info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Server response:", data); // Debug
    if (data.success) {
      setMessage("✅ Resume added successfully!");
    } else {
      setMessage(`❌ ${data.error || "Failed to add resume"}`);
    }
  } catch (err) {
    console.error("Error submitting:", err);
    setMessage("⚠️ Server error");
  }
};


  return (
    
<div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
  <div className="max-w-5xl mx-auto p-6">
    <div className="text-center mb-8">
      <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
        Build Your Resume
      </h2>
      <p className="text-gray-600 text-lg">Create a professional resume that stands out</p>
    </div>

    {message && (
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 rounded-xl shadow-lg text-center font-medium">
        {message}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
    
    {/* Personal Info */}
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">1</span>
        Personal Information
      </h3>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(formData.personalInfo).map((key) => (
          <input
            key={key}
            type="text"
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            className="border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm"
            value={formData.personalInfo[key]}
            onChange={(e) =>
              handleChange("personalInfo", key, e.target.value)
            }
          />
        ))}
      </div>
    </div>

    {/* Career Objective */}
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm">2</span>
        Career Objective
      </h3>
      <textarea
        placeholder="Describe your career goals and what you're looking for..."
        className="border border-gray-200 p-4 rounded-xl w-full h-32 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm resize-none"
        value={formData.careerObjective}
        onChange={(e) =>
          handleChange("careerObjective", null, e.target.value)
        }
      />
    </div>

    {/* Skills & Tech Stack */}
    {["skills", "techStack"].map((field, sectionIdx) => (
      <div key={field} className={`bg-gradient-to-r ${sectionIdx === 0 ? 'from-emerald-50 to-teal-50 border-emerald-100' : 'from-amber-50 to-orange-50 border-amber-100'} p-6 rounded-2xl border`}>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className={`w-8 h-8 bg-gradient-to-r ${sectionIdx === 0 ? 'from-emerald-500 to-teal-500' : 'from-amber-500 to-orange-500'} rounded-full flex items-center justify-center text-white text-sm`}>{sectionIdx + 3}</span>
          {field === 'skills' ? 'Core Skills' : 'Tech Stack'}
        </h3>
        <div className="space-y-3">
          {formData[field].map((item, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`${field === 'skills' ? 'Skill' : 'Technology'} ${idx + 1}`}
              className="border border-gray-200 p-4 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm"
              value={item}
              onChange={(e) => handleChange(field, null, e.target.value, idx)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => addField(field, "")}
          className={`mt-4 bg-gradient-to-r ${sectionIdx === 0 ? 'from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600' : 'from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'} text-white px-6 py-2 rounded-xl font-medium transition-all transform hover:scale-105`}
        >
          + Add {field === 'skills' ? 'Skill' : 'Technology'}
        </button>
      </div>
    ))}

    {/* Work Experience, Projects, Education */}
    {[
      { name: "Work Experience", key: "workExperience", cols: 2 },
      { name: "Projects", key: "projects", cols: 3 },
      { name: "Education", key: "education", cols: 5 },
    ].map((section) => (
      <div key={section.key}>
        <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
          {section.name}
        </h3>
        {formData[section.key].map((item, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-1 sm:grid-cols-${section.cols} gap-4 mb-2`}
          >
            {Object.keys(item).map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                value={item[field]}
                onChange={(e) =>
                  handleChange(section.key, field, e.target.value, idx)
                }
              />
            ))}
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            addField(
              section.key,
              section.key === "workExperience"
                ? { role: "", duration: "", company: "", description: "" }
                : section.key === "projects"
                ? { title: "", description: "", link: "" }
                : { degree: "", fieldOfStudy: "", institution: "", startYear: "", endYear: "" }
            )
          }
          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
        >
          + Add {section.name.slice(0, -1)}
        </button>
      </div>
    ))}

    {/* Submit Button */}
    <div className="text-center pt-6">
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl"
      >
        🚀 Create My Resume
      </button>
    </div>
    </form>
  </div>
</div>

  );
}
