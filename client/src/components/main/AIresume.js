import { Key } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ViewAIResume() {
  const { id } = useParams(); // grab resumeId from URL
  const [aiResumes, setAiResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAIResumes = async () => {
      try {
        const res = await fetch(`http://localhost:5000/aboutResume/get-ai-resume/${id}`, {
          headers: { "auth-token": localStorage.getItem("token") ||" " },
        });
        const data = await res.json();

        if (res.ok) {
          setAiResumes(data);
        } else {
          setMessage(data.message || "Failed to fetch AI resumes");
        }
      } catch (error) {
        setMessage("No resume Generated");
      } finally {
        setLoading(false);
      }
    };

    fetchAIResumes();
  }, [id]);

  if (loading) return <div className="text-center mt-20">Loading AI resumes...</div>;

  const downloadAIResume = async (resumeOpId) => {
  try {
    const res = await fetch(`http://localhost:5000/resume/download-resume/${resumeOpId}`, {
      method: "GET",
      headers: { "auth-token": localStorage.getItem("token") },
    });

    if (!res.ok) {
      throw new Error("Failed to download resume");
    }

    // Convert response to blob
    const blob = await res.blob();

    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary <a> tag to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = "refined-resume.pdf";
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error downloading resume:", err);
    alert("⚠️ Error while downloading resume");
  }
};

const deleteAiResume = async (resumeId) => {
  try {
    const res = await fetch(
      `http://localhost:5000/aboutResume/delete-ai-resume/${resumeId}`,
      {
        method: "DELETE",
        headers: {
          "auth-token": localStorage.getItem("token") || " ",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete resume");
    }

    // Update state locally to remove the deleted resume
    setAiResumes((prev) => prev.filter((resume) => resume._id !== resumeId));

    setMessage("✅ Resume deleted successfully!");
  } catch (err) {
    console.error(err);
    setMessage("⚠️ Server error while deleting AI resume");
  }
};


  return (
    <div className="pt-20 max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700">
        AI Generated Resumes
      </h2>

      {message && (
        <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800 font-medium text-center shadow">
          {message}
        </div>
      )}

      {aiResumes.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          No AI resumes generated yet.
        </div>
      ) : (
        <div className="space-y-6">
          {aiResumes.map((resume) => (
            <div
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Generated on: {new Date(resume.cretated_at).toLocaleString()}
              </h3>
              <p className="text-gray-800 mb-2">
                <strong>Refined Resume:</strong>
              </p>
              <pre className="whitespace-pre-wrap bg-gray-200 p-4 rounded text-gray-800">
                {resume.refinedResume || "Not available"}
              </pre>
              <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg m-2 shadow text-center hover:bg-indigo-700 transition"
              onClick={()=>downloadAIResume(resume._id)}>
                Download Resume
              </button>

              <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg ml-5 shadow text-center hover:bg-red-700 transition"
              onClick={()=>deleteAiResume(resume._id)}>
                Delete Resume
              </button>
              
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          🔙 Back
        </button>
      </div>
    </div>
  );
}
