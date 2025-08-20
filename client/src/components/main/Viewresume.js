import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function AllResumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const messageTimeout = useRef(null);
  const navigate = useNavigate();

  const showMessage = (msg) => {
    setMessage(msg);
    if (messageTimeout.current) clearTimeout(messageTimeout.current);
    messageTimeout.current = setTimeout(() => setMessage(""), 3000);
  };

  const fetchResumes = async () => {
    try {
      const res = await fetch("http://localhost:5000/resume/get-resumes", {
        headers: { "auth-token": localStorage.getItem("token") },
      });
      const data = await res.json();
      if (data.success) setResumes(data.userResumes || []);
      else showMessage(data.error || "Failed to fetch resumes");
    } catch (err) {
      console.error(err);
      showMessage("Server error while fetching resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const deleteResume = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      const res = await fetch(`http://localhost:5000/resume/delete-resume/${id}`, {
        method: "DELETE",
        headers: { "auth-token": localStorage.getItem("token") },
      });
      const data = await res.json();
      if (data.success) {
        showMessage("✅ Resume deleted successfully!");
        setResumes((prev) => prev.filter((r) => r._id !== id));
      } else showMessage(data.error || "Failed to delete resume");
    } catch (err) {
      console.error(err);
      showMessage("⚠️ Server error while deleting resume");
    }
  };

  const generateAiResume = async (id) => {
    try {
      setAiLoading(true);
      showMessage("🤖 Generating AI resume...");
      const res = await fetch(`http://localhost:5000/resume/build-resume/${id}`, {
        method: "POST",
        headers: { "auth-token": localStorage.getItem("token") },
      });
      const data = await res.json();
      if (data.success) {
        showMessage("✅ AI Resume generated successfully!");
      } else {
        showMessage(data.error || "Failed to generate AI resume");
      }
    } catch (err) {
      console.error(err);
      showMessage("⚠️ Server error while generating AI resume");
    } finally {
      setAiLoading(false);
    }
  };

  const downloadResume = async (id) => {
    navigate(`/view-ai-resume/${id}`)
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-lg font-medium">
        Loading resumes...
      </div>
    );

  return (
    <div className="pt-20 max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-indigo-700">
        All Resumes
      </h2>

      {message && (
        <div className="mb-6 p-4 rounded-lg text-center bg-indigo-100 text-indigo-800 font-medium shadow-lg">
          {message}
        </div>
      )}

      {resumes.length === 0 && (
        <div className="text-center text-gray-600 text-lg">
          No resumes found. Add one first!
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {resumes.map((resume) => (
          <div
            className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {resume.personalInfo.name || "Unnamed Resume"}
              </h3>
              <p className="text-gray-600 mb-1">
                <strong>Email:</strong> {resume.personalInfo.email || "-"}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Phone:</strong> {resume.personalInfo.phone || "-"}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Skills:</strong> {resume.skills.join(", ") || "-"}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Tech Stack:</strong> {resume.techStack.join(", ") || "-"}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => generateAiResume(resume._id)}
                disabled={aiLoading}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-lg shadow font-medium transition ${
                  aiLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-indigo-700"
                }`}
              >
                {aiLoading ? "Generating..." : "Generate AI Resume"}
              </button>

              <button
                onClick={() => navigate(`/edit-resume/${resume._id}`)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition font-medium"
              >
                Edit
              </button>

              <button
                onClick={() => deleteResume(resume._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition font-medium"
              >
                Delete
              </button>

              <button
                onClick={() => downloadResume(resume._id)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition font-medium"
              >
                Download/View Resume
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
