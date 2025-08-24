import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Editresume() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(true);

  // Fetch the resume data
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch(`${Api}/resume/get-resume/${id}`, {
          headers: { "auth-token": localStorage.getItem("token") },
        });
        const data = await res.json();
        if (data.success && data.resume) {
          setFormData(data.resume);
        } else {
          setMessage(data.error || "Failed to fetch resume");
        }
      } catch (err) {
        console.error(err);
        setMessage("Server error while fetching resume");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, );

  const handleChange = (section, field, value, index = null) => {
    if (Array.isArray(formData[section])) {
      const updated = [...formData[section]];
      if (typeof updated[index] === "string") updated[index] = value;
      else updated[index][field] = value;
      setFormData((prev) => ({ ...prev, [section]: updated }));
    } else if (typeof formData[section] === "object") {
      setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [section]: value }));
    }
  };

  const addField = (section, newItem) => {
    setFormData((prev) => ({ ...prev, [section]: [...prev[section], newItem] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${Api}/resume/edit-resume/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "auth-token": localStorage.getItem("token") },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Resume updated successfully!");
        navigate("/view-resume"); // go back to the resumes list
      } else {
        setMessage(data.error || "Failed to update resume");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Server error while updating resume");
    }
  };

  if (loading) return <div className="text-center mt-20 text-lg font-medium">Loading resume...</div>;

  return (
    <div className="pt-20 max-w-5xl mx-auto p-6 bg-gray-50">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700">Edit Resume</h2>

      {message && (
        <div className="mb-6 p-3 rounded-lg text-center bg-indigo-100 text-indigo-800 font-medium shadow">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <section className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Personal Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.keys(formData.personalInfo).map((key) => (
              <input
                key={key}
                type="text"
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                value={formData.personalInfo[key]}
                onChange={(e) => handleChange("personalInfo", key, e.target.value)}
              />
            ))}
          </div>
        </section>

        {/* Career Objective */}
        <section className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Career Objective</h3>
          <textarea
            placeholder="Career Objective"
            className="border border-gray-300 p-3 rounded-lg w-full h-24 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition resize-none"
            value={formData.careerObjective}
            onChange={(e) => handleChange("careerObjective", null, e.target.value)}
          />
        </section>

        {/* Skills & Tech Stack */}
        {["skills", "techStack"].map((section) => (
          <section key={section} className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              {section === "skills" ? "Skills" : "Tech Stack"}
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {formData[section].map((item, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`${section === "skills" ? "Skill" : "Tech"} ${idx + 1}`}
                  className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  value={item}
                  onChange={(e) => handleChange(section, null, e.target.value, idx)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => addField(section, "")}
              className="mt-3 inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
            >
              + Add {section === "skills" ? "Skill" : "Tech"}
            </button>
          </section>
        ))}

        {/* Work Experience, Projects, Education */}
        {[
          { key: "workExperience", cols: 2, title: "Work Experience" },
          { key: "projects", cols: 3, title: "Projects" },
          { key: "education", cols: 5, title: "Education" },
        ].map(({ key, cols, title }) => (
          <section key={key} className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">{title}</h3>
            {formData[key].map((item, idx) => (
              <div key={idx} className={`grid md:grid-cols-${cols} gap-4 mb-3`}>
                {Object.keys(item).map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    value={item[field]}
                    onChange={(e) => handleChange(key, field, e.target.value, idx)}
                  />
                ))}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const emptyItem = Object.fromEntries(Object.keys(formData[key][0]).map((f) => [f, ""]));
                addField(key, emptyItem);
              }}
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
            >
              + Add {title.slice(0, -1)}
            </button>
          </section>
        ))}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition font-semibold text-lg"
          >
            Update Resume
          </button>
        </div>
      </form>
    </div>
  );
}
