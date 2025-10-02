import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, MessageSquare, FileText } from "lucide-react";

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
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm font-medium mb-8">
              <MessageSquare className="w-4 h-4 mr-2" />
              Resume Management
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              My
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Resumes
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Manage and enhance your professional resumes
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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

          {resumes.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-white rounded-3xl p-16 shadow-2xl max-w-lg mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <FileText className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">No Resumes Yet</h3>
                <p className="text-gray-600 mb-8 text-lg">Create your first professional resume to get started on your career journey!</p>
                <button
                  onClick={() => navigate('/build-resume')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Create Your First Resume
                </button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumes.map((resume, index) => (
              <div
                key={resume._id}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${index % 3 === 0 ? 'from-blue-600 to-purple-600' : index % 3 === 1 ? 'from-emerald-600 to-teal-600' : 'from-amber-600 to-orange-600'} flex items-center justify-center text-white font-bold text-xl`}>
                      {(resume.personalInfo.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {resume.personalInfo.name || "Unnamed Resume"}
                      </h3>
                      <p className="text-gray-600">{resume.personalInfo.email || "No email"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <p className="text-sm font-medium text-blue-900 mb-1">Skills</p>
                      <p className="text-blue-700">{resume.skills.slice(0, 3).join(", ")} {resume.skills.length > 3 && `+${resume.skills.length - 3} more`}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <p className="text-sm font-medium text-purple-900 mb-1">Tech Stack</p>
                      <p className="text-purple-700">{resume.techStack.slice(0, 2).join(", ")} {resume.techStack.length > 2 && `+${resume.techStack.length - 2} more`}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => generateAiResume(resume._id)}
                    disabled={aiLoading}
                    className={`w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold transition-all duration-300 ${
                      aiLoading ? "opacity-60 cursor-not-allowed" : "hover:from-blue-700 hover:to-purple-700 transform hover:scale-105"
                    }`}
                  >
                    {aiLoading ? "Generating..." : "Generate AI Resume"}
                  </button>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => navigate(`/edit-resume/${resume._id}`)}
                      className="px-4 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-all duration-300"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => downloadResume(resume._id)}
                      className="px-4 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all duration-300"
                    >
                      View
                    </button>

                    <button
                      onClick={() => deleteResume(resume._id)}
                      className="px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
