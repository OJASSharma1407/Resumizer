import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Viewcoverletter() {
  const [coverLetters, setCoverLetters] = useState([]);
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

  const fetchCoverLetters = async () => {
    try {
      const res = await fetch(`${Api}/coverLetter/get-cover-letters`, {
        headers: { "auth-token": localStorage.getItem("token") },
      });
      const data = await res.json();
      console.log(data);
      if (data.success) setCoverLetters(data.coverLetters || []);
      else showMessage(data.error || "Failed to fetch cover letters");
    } catch (err) {
      console.error(err);
      showMessage("⚠️ Server error while fetching cover letters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoverLetters();
  }, );

  const deleteCoverLetter = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cover letter?")) return;

    try {
      const res = await fetch(`${Api}/coverLetter/delete-cover-letter/${id}`, {
        method: "DELETE",
        headers: { "auth-token": localStorage.getItem("token") },
      });
      const data = await res.json();
      if (data.success) {
        showMessage("✅ Cover Letter deleted successfully!");
        setCoverLetters((prev) => prev.filter((c) => c._id !== id));
      } else showMessage(data.error || "Failed to delete cover letter");
    } catch (err) {
      console.error(err);
      showMessage("⚠️ Server error while deleting cover letter");
    }
  };

  const generateAiCoverLetter = async (id) => {
    try {
      setAiLoading(true);
      showMessage("🤖 Generating AI cover letter...");
      const res = await fetch(`${Api}/coverletter/generate-cover-letter/${id}`, {
        method: "POST",
        headers: { "auth-token": localStorage.getItem("token") },
      });
      const data = await res.json();
      if (data.success) {
        showMessage("✅ AI Cover Letter generated successfully!");
      } else {
        showMessage(data.error || "Failed to generate AI cover letter");
      }
    } catch (err) {
      console.error(err);
      showMessage("⚠️ Server error while generating AI cover letter");
    } finally {
      setAiLoading(false);
    }
  };

  const viewCoverLetter = (id) => {
    navigate(`/view-Aicover-letter/${id}`);
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-lg font-medium">
        Loading cover letters...
      </div>
    );

  return (
    <div className="pt-20 max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-indigo-700">
        All Cover Letters
      </h2>

      {message && (
        <div className="mb-6 p-4 rounded-lg text-center bg-indigo-100 text-indigo-800 font-medium shadow-lg">
          {message}
        </div>
      )}

      {coverLetters.length === 0 && (
        <div className="text-center text-gray-600 text-lg">
          No cover letters found. Add one first!
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {coverLetters.map((cover) => (
          <div
            key={cover._id}
            className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {cover.personalInfo?.fullName || "Unnamed Cover Letter"}
              </h3>
              <p className="text-gray-600 mb-1">
                <strong>Email:</strong> {cover.personalInfo?.email || "-"}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Phone:</strong> {cover.personalInfo?.phone || "-"}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>LinkedIn:</strong> {cover.personalInfo?.linkedIn || "-"}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Description:</strong> {cover.description || "-"}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => generateAiCoverLetter(cover._id)}
                disabled={aiLoading}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-lg shadow font-medium transition ${
                  aiLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-indigo-700"
                }`}
              >
                {aiLoading ? "Generating..." : "Generate AI Cover Letter"}
              </button>

              <button
                onClick={() => navigate(`/edit-cover-letter/${cover._id}`)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition font-medium"
              >
                Edit
              </button>

              <button
                onClick={() => deleteCoverLetter(cover._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition font-medium"
              >
                Delete
              </button>

              <button
                onClick={() => viewCoverLetter(cover._id)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition font-medium"
              >
                View/Download Cover Letter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
