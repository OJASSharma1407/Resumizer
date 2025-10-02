import React, { useState } from "react";
import { FileText, CheckCircle2 } from "lucide-react";

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
    
<div className="min-h-screen bg-white">
  {/* Header Section */}
  <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
    <div className="absolute inset-0 bg-black/20"></div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm font-medium mb-8">
          <FileText className="w-4 h-4 mr-2" />
          Resume Builder
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Build Your
          <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Professional Resume
          </span>
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Create a standout resume with our AI-powered builder
        </p>
      </div>
    </div>
  </section>

  {/* Form Section */}
  <section className="py-24 bg-gray-50">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

      {message && (
        <div className="mb-8 p-6 bg-white border-l-4 border-blue-600 rounded-2xl shadow-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-4">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <p className="text-gray-800 font-medium">{message}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
    
        {/* Personal Info */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-4">
              1
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(formData.personalInfo).map((key) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  placeholder={`Enter your ${key.toLowerCase()}`}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={formData.personalInfo[key]}
                  onChange={(e) => handleChange("personalInfo", key, e.target.value)}
                />
              </div>
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
        <div className="p-8 bg-gray-50">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Create My Resume
          </button>
        </div>
      </form>
    </div>
  </section>
</div>

  );
}
