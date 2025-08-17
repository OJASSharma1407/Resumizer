import React, { useEffect, useState } from "react";

export default function AIresume() {
  const [aiResumes, setAiResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Show temporary messages
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  // Fetch all AI-generated resumes for the logged-in user
  const fetchAIResumes = async () => {
    try {
      const res = await fetch("http://localhost:5000/aboutResume/get-ai-resumes", {
        headers: { "auth-token": localStorage.getItem("token") || "" },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      if (data.success) {
        setAiResumes(data.aiResumes || []);
      } else {
        showMessage(data.error || "Failed to fetch AI resumes");
      }
    } catch (err) {
      console.error(err);
      showMessage("Server error while fetching AI resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIResumes();
  }, []);

  // Download PDF of the refined resume
  const downloadPDF = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/resume/download-resume/${id}`, {
        headers: { "auth-token": localStorage.getItem("token") || "" },
      });

      if (!res.ok) throw new Error("Failed to download PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "ai-resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error downloading PDF. Make sure you are logged in.");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-lg font-medium">
        Loading AI resumes...
      </div>
    );

  return (
          <div className="pt-20 max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <h2 className="text-4xl font-extrabold mb-12 text-center text-indigo-700">
          AI Generated Resumes
        </h2>

        {message && (
          <div className="mb-6 p-4 rounded-lg text-center bg-indigo-100 text-indigo-800 font-medium shadow transition-all duration-300">
            {message}
          </div>
        )}

        {aiResumes.length === 0 && !loading && (
          <div className="text-center text-gray-600 text-lg">
            No AI resumes found. Generate one first!
          </div>
        )}

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiResumes.map((resumeOp) => (
            <div
              key={resumeOp._id}
              className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between transform transition hover:scale-105 hover:shadow-xl"
            >
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2 truncate">
                  {resumeOp.resume?.personalInfo?.name || "Unnamed AI Resume"}
                </h3>
                <p className="text-gray-600 flex items-center mb-1">
                  <strong className="mr-1">Generated for:</strong>{" "}
                  <a
                    href={`mailto:${resumeOp.resume?.personalInfo?.email}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {resumeOp.resume?.personalInfo?.email || "-"}
                  </a>
                </p>
                <p className="text-gray-600 flex items-center mb-1">
                  <strong className="mr-1">Date:</strong>{" "}
                  {resumeOp.resume?.createdAt
                    ? new Date(resumeOp.resume.createdAt).toLocaleString()
                    : "-"}
                </p>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => downloadPDF(resumeOp._id)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl shadow hover:bg-indigo-700 transition duration-300"
                >
                  View / Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

  );
}
