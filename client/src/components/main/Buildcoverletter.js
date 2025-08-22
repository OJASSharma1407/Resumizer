import React, { useState } from "react";

export default function CoverLetterForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedIn: "",
    description: "",
  });
  const [message,setMessage]= useState("");
  const handleChange = async(e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('http://localhost:5000/coverletter/create-cover-letter', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token'),
      },
      body: JSON.stringify({
        personalInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          linkedIn: formData.linkedIn,
        },
        description: formData.description,
})
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Cover Letter Added Successfully ✅");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        linkedIn: "",
        description: "",
      }); // reset form after submit
    } else {
      setMessage(data.error || "Something went wrong ❌");
    }
  } catch (err) {
    console.error(err);
    setMessage("Server error. Please try again later ⚠️");
  }
};


  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow rounded-2xl">
        <h2 className="text-3xl font-extrabold mt-3 mb-8 text-center text-indigo-600">
          Create Cover Letter
        </h2>
          {message && (
    <div className="mb-6 p-4 bg-indigo-100 text-indigo-800 rounded-lg shadow text-center font-medium transition-all duration-300">
      {message}
    </div>
  )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-gray-700 mb-1">LinkedIn (optional)</label>
          <input
            type="text"
            name="linkedIn"
            value={formData.linkedIn}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-gray-700 mb-1">Job Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Enter job role, company details, or description here..."
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Save Info
          </button>
        </div>
      </form>
    </div>
  );
}
