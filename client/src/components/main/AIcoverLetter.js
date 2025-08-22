import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ViewAiCoverLetter() {
  const [coverLetter, setCoverLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Fetch AI Cover Letter
  useEffect(() => {
    const fetchCoverLetter = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/coverletter/view-ai-coverLetter/${id}`,
          {
            headers: { "auth-token": localStorage.getItem("token") || "" },
          }
        );

        const data = await res.json();
          console.log(data);
        if (res.ok && data.success) {
          setCoverLetter(data.coverLetter || null);
        } else {
          setMessage(data.error || "Failed to fetch AI cover letter");
        }
      } catch (err) {
        console.error(err);
        setMessage("⚠️ Server error while fetching AI cover letter");
      } finally {
        setLoading(false);
      }
    };

    fetchCoverLetter();
  }, [id]);

  // ✅ Delete AI Cover Letter
  const deleteCoverLetter = async () => {
    if (!window.confirm("Are you sure you want to delete this cover letter?"))
      return;

    try {
      const res = await fetch(
        `http://localhost:5000/coverletter/remove-coverletter/${id}`,
        {
          method: "PUT",
          headers: { "auth-token": localStorage.getItem("token") || "" },
        }
      );

      if (!res.ok) throw new Error("Failed to delete cover letter");

      setMessage("✅ Cover Letter deleted successfully!");
      setTimeout(() => navigate("/view-cover-letters"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Server error while deleting cover letter");
    }
  };

  // ✅ Download AI Cover Letter as PDF
  const downloadCoverLetter = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/coverletter/download-cover-letter/${id}`,
        {
          headers: { "auth-token": localStorage.getItem("token") || "" },
        }
      );

      if (!res.ok) throw new Error("Failed to download");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "CoverLetter.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to download cover letter");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-lg font-medium">
        Loading AI Cover Letter...
      </div>
    );

  return (
    <div className="pt-20 max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700">
        AI Generated Cover Letter
      </h2>

      {message && (
        <div className="mb-6 p-4 rounded-lg bg-indigo-100 text-indigo-800 font-medium text-center shadow">
          {message}
        </div>
      )}

      {coverLetter ? (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            {coverLetter.personalInfo?.fullName || "Unnamed Applicant"}
          </h3>
          <p className="text-gray-600 mb-2">
            <strong>Email:</strong> {coverLetter.personalInfo?.email || "N/A"}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Phone:</strong> {coverLetter.personalInfo?.phone || "N/A"}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>LinkedIn:</strong> {coverLetter.personalInfo?.linkedIn || "N/A"}
          </p>

          <div className="mt-4">
            <strong className="text-gray-800">Cover Letter:</strong>
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded mt-2 text-gray-700">
              {coverLetter.coverletter || "No AI cover letter generated"}
            </pre>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={downloadCoverLetter}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              ⬇️ Download
            </button>

            <button
              onClick={deleteCoverLetter}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
            >
              🗑️ Delete
            </button>

            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition"
            >
              🔙 Back
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600">
          No AI Cover Letter available.
        </div>
      )}
    </div>
  );
}
