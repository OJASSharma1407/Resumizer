import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditCoverLetter() {
  const { id } = useParams();
  const navigate = useNavigate();

  const Api = process.env.REACT_APP_API_URL;
  const [coverLetter, setCoverLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch cover letter details
  useEffect(() => {
    const fetchCoverLetter = async () => {
      try {
        const res = await fetch(
          `${Api}/coverLetter/view-ai-coverLetter/${id}`,
          {
            headers: {
              "auth-token": localStorage.getItem("token") || "",
            },
          }
        );

        const data = await res.json();
        if (res.ok && data.success) {
          setCoverLetter(data.coverLetter);
        } else {
          setMessage(data.error || "Failed to load cover letter");
        }
      } catch (err) {
        setMessage("⚠️ Server error while fetching cover letter");
      } finally {
        setLoading(false);
      }
    };

    fetchCoverLetter();
  }, );

  // Handle form submit
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${Api}/coverLetter/edit-cover-letter/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token") || "",
          },
          body: JSON.stringify({
            personalInfo: coverLetter.personalInfo,
            description: coverLetter.description,
            coverletter: coverLetter.coverletter,
          }),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("✅ Cover letter updated successfully!");
        setTimeout(() => navigate(`/view-cover-letter`), 1500);
      } else {
        setMessage(data.error || "Failed to update cover letter");
      }
    } catch (err) {
      setMessage("⚠️ Error updating cover letter");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  if (!coverLetter) {
    return (
      <div className="text-center mt-20 text-gray-600">
        ❌ No cover letter found
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        Edit Cover Letter
      </h2>

      {message && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-center shadow">
          {message}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Personal Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={coverLetter.personalInfo?.fullName || ""}
              onChange={(e) =>
                setCoverLetter({
                  ...coverLetter,
                  personalInfo: {
                    ...coverLetter.personalInfo,
                    fullName: e.target.value,
                  },
                })
              }
              className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={coverLetter.personalInfo?.email || ""}
              onChange={(e) =>
                setCoverLetter({
                  ...coverLetter,
                  personalInfo: {
                    ...coverLetter.personalInfo,
                    email: e.target.value,
                  },
                })
              }
              className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone</label>
            <input
              type="text"
              value={coverLetter.personalInfo?.phone || ""}
              onChange={(e) =>
                setCoverLetter({
                  ...coverLetter,
                  personalInfo: {
                    ...coverLetter.personalInfo,
                    phone: e.target.value,
                  },
                })
              }
              className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              LinkedIn
            </label>
            <input
              type="text"
              value={coverLetter.personalInfo?.linkedIn || ""}
              onChange={(e) =>
                setCoverLetter({
                  ...coverLetter,
                  personalInfo: {
                    ...coverLetter.personalInfo,
                    linkedIn: e.target.value,
                  },
                })
              }
              className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            value={coverLetter.description}
            onChange={(e) =>
              setCoverLetter({ ...coverLetter, description: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            rows={3}
          />
        </div>
    

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            💾 Save Changes
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition"
          >
            🔙 Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
