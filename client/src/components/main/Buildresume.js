import React, { useState } from "react";

export default function AddResume() {
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
    const res = await fetch("http://localhost:5000/resume/add-resume-info", {
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
    
<div className="pt-20 max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
  <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-600">
    Add Resume Info
  </h2>

  {message && (
    <div className="mb-6 p-4 bg-indigo-100 text-indigo-800 rounded-lg shadow text-center font-medium transition-all duration-300">
      {message}
    </div>
  )}

  <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-lg">
    
    {/* Personal Info */}
    <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
      Personal Information
    </h3>
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
      {Object.keys(formData.personalInfo).map((key) => (
        <input
          key={key}
          type="text"
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          value={formData.personalInfo[key]}
          onChange={(e) =>
            handleChange("personalInfo", key, e.target.value)
          }
        />
      ))}
    </div>

    {/* Career Objective */}
    <div>
      <textarea
        placeholder="Career Objective"
        className="border border-gray-300 p-3 rounded-lg w-full h-24 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
        value={formData.careerObjective}
        onChange={(e) =>
          handleChange("careerObjective", null, e.target.value)
        }
      />
    </div>

    {/* Skills & Tech Stack */}
    {["skills", "techStack"].map((field) => (
      <div key={field}>
        <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2 capitalize">
          {field.replace(/([A-Z])/g, " $1")}
        </h3>
        {formData[field].map((item, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`${field.slice(0, -1)} ${idx + 1}`}
            className="border border-gray-300 p-3 rounded-lg w-full mb-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            value={item}
            onChange={(e) => handleChange(field, null, e.target.value, idx)}
          />
        ))}
        <button
          type="button"
          onClick={() => addField(field, "")}
          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition mt-1"
        >
          + Add {field.slice(0, -1)}
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
    <button
      type="submit"
      className="w-full bg-blue-600 text-white px-4 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition mt-6"
    >
      Add Resume
    </button>
  </form>
</div>

  );
}
