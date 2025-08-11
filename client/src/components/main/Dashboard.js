import React from "react";
import { motion } from "framer-motion";
import { FileText, MessageSquare, Download, PenTool, Zap, ShieldCheck, CheckCircle2, Quote } from "lucide-react";


export default function Dashboard() {
  const features = [
    {
      icon: <FileText size={50} className="text-indigo-500" />,
      title: "AI Resume Generator",
      desc1: "Instantly turns your details into a polished, professional resume.",
      desc2: "No formatting headaches, just a document that recruiters notice."
    },
    {
      icon: <MessageSquare size={50} className="text-green-500" />,
      title: "Resume Feedback",
      desc1: "Smart AI suggestions to make your resume sharper and more effective.",
      desc2: "Highlights gaps and shows you how to fill them."
    },
    {
      icon: <Download size={50} className="text-orange-500" />,
      title: "PDF Download",
      desc1: "One click to get a print-ready PDF resume.",
      desc2: "Perfect formatting every time."
    },
    {
      icon: <PenTool size={50} className="text-purple-500" />,
      title: "AI Cover Letter Creator",
      desc1: "Custom-tailored letters for each job application.",
      desc2: "Persuasive and role-specific."
    },
    {
      icon: <Zap size={50} className="text-yellow-500" />,
      title: "One-Click Apply",
      desc1: "Apply directly to jobs without leaving RESUMIZER.",
      desc2: "Keeps all your applications in one place."
    },
    {
      icon: <ShieldCheck size={50} className="text-blue-500" />,
      title: "Data Privacy",
      desc1: "Your data stays encrypted and secure.",
      desc2: "We never sell your information."
    }
  ];

  return (
    <div className="bg-gray-50">
      

      {/* HERO */}
      <section
        id="home"
        className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24 bg-gradient-to-br from-indigo-100 via-white to-indigo-50"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-gray-800 max-w-3xl"
        >
          Build Your Perfect Resume <span className="text-indigo-600">with AI</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-4 text-lg text-gray-600 max-w-2xl"
        >
          RESUMIZER helps you create, improve, and send job-winning applications — all in one place.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-8 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition"
        >
          Get Started
        </motion.button>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {[
          { value: "10k+", label: "Resumes Created" },
          { value: "98%", label: "Positive Feedback" },
          { value: "50+", label: "Job Portals Integrated" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <h2 className="text-4xl font-bold text-indigo-600">{stat.value}</h2>
            <p className="text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 space-y-16">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 px-6 ${
              i % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="flex-shrink-0">{f.icon}</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{f.title}</h3>
              <p className="text-gray-600 mt-2">{f.desc1}</p>
              <p className="text-gray-600">{f.desc2}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* WHY US */}
      <section
        id="why"
        className="py-20 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white"
      >
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose RESUMIZER?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              "Fast & Easy to Use",
              "ATS-Friendly Templates",
              "Tailored to Your Industry",
              "Secure & Private",
              "Integrated Job Search",
              "24/7 Support"
            ].map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 size={28} />
                <span>{point}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        id="testimonials"
        className="py-20 bg-gray-100"
      >
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Aarav Sharma", text: "RESUMIZER made job hunting so much easier for me. The AI resume feedback was a game changer!" },
              { name: "Priya Desai", text: "I loved the cover letter tool. It felt personal and professional at the same time." },
              { name: "Rohan Verma", text: "Clean, fast, and the one-click apply saved me hours every week." }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow p-6 text-gray-600"
              >
                <Quote className="mx-auto mb-4 text-indigo-500" />
                <p>"{t.text}"</p>
                <h4 className="mt-4 font-bold text-gray-800">{t.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        id="cta"
        className="py-20 bg-indigo-600 text-white text-center"
      >
        <h2 className="text-4xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
        <p className="mb-8 text-lg">
          Create your resume, get feedback, and apply — all in minutes.
        </p>
        <button className="bg-white text-indigo-600 font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition">
          Get Started for Free
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-gray-500 text-sm bg-white">
        © {new Date().getFullYear()} RESUMIZER. All rights reserved.
      </footer>
    </div>
  );
}
