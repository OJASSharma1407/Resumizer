import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function AllResumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const messageTimeout = useRef(null);
  const navigate = useNavigate();
  const Api = process.env.REACT_APP_API_URL;
  const showMessage = (msg) => {
    setMessage(msg);
    if (messageTimeout.current) clearTimeout(messageTimeout.current);
    messageTimeout.current = setTimeout(() => setMessage(""), 3000);
  };

  const fetchResumes = async () => {
    try {
      const res = await fetch(`${Api}/resume/get-resumes`, {
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
  }, );

  const deleteResume = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      const res = await fetch(`${Api}/resume/delete-resume/${id}`, {
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
      const res = await fetch(`${Api}/resume/build-resume/${id}`, {
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
    <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            My Resumes
          </h2>
          <p className="text-gray-600 text-lg">Manage and enhance your professional resumes</p>
        </div>

        {message && (
          <div className="mb-8 p-4 rounded-xl text-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 font-medium shadow-lg">
            {message}
          </div>
        )}

        {resumes.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 max-w-md mx-auto">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Resumes Yet</h3>
              <p className="text-gray-600 mb-6">Create your first professional resume to get started!</p>
              <button
                onClick={() => navigate('/build-resume')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Create Resume
              </button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume, index) => (
            <div
              key={resume._id}
              className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-6 border border-white/20 hover:shadow-2xl transition-all transform hover:scale-105"
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${index % 3 === 0 ? 'from-blue-500 to-purple-500' : index % 3 === 1 ? 'from-emerald-500 to-teal-500' : 'from-amber-500 to-orange-500'} flex items-center justify-center text-white font-bold text-lg`}>
                    {(resume.personalInfo.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {resume.personalInfo.name || "Unnamed Resume"}
                    </h3>
                    <p className="text-gray-500 text-sm">{resume.personalInfo.email || "No email"}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-600"><strong>Skills:</strong> {resume.skills.slice(0, 3).join(", ")} {resume.skills.length > 3 && `+${resume.skills.length - 3} more`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="text-gray-600"><strong>Tech:</strong> {resume.techStack.slice(0, 2).join(", ")} {resume.techStack.length > 2 && `+${resume.techStack.length - 2} more`}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => generateAiResume(resume._id)}
                  disabled={aiLoading}
                  className={`w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all transform ${
                    aiLoading ? "opacity-60 cursor-not-allowed" : "hover:from-blue-700 hover:to-purple-700 hover:scale-105"
                  }`}
                >
                  {aiLoading ? "🤖 Generating..." : "🚀 Generate AI Resume"}
                </button>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => navigate(`/edit-resume/${resume._id}`)}
                    className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => downloadResume(resume._id)}
                    className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all"
                  >
                    👁️ View
                  </button>

                  <button
                    onClick={() => deleteResume(resume._id)}
                    className="px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-pink-600 transition-all"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
