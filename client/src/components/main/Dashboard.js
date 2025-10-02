import React from "react";
import { motion } from "framer-motion";
import { FileText, MessageSquare, Download, PenTool, Zap, ShieldCheck, CheckCircle2, Quote, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const features = [
    {
      icon: <FileText size={50} className="text-blue-500" />,
      title: "AI Resume Generator",
      desc1: "Instantly turns your details into a polished, professional resume.",
      desc2: "No formatting headaches, just a document that recruiters notice.",
      action: () => navigate("/build-resume")
    },
    {
      icon: <MessageSquare size={50} className="text-emerald-500" />,
      title: "Resume Feedback",
      desc1: "Smart AI suggestions to make your resume sharper and more effective.",
      desc2: "Highlights gaps and shows you how to fill them.",
      action: () => navigate("/view-resume")
    },
    {
      icon: <Download size={50} className="text-amber-500" />,
      title: "PDF Download",
      desc1: "One click to get a print-ready PDF resume.",
      desc2: "Perfect formatting every time.",
      action: () => navigate("/view-resume")
    },
    {
      icon: <PenTool size={50} className="text-purple-500" />,
      title: "AI Cover Letter Creator",
      desc1: "Custom-tailored letters for each job application.",
      desc2: "Persuasive and role-specific.",
      action: () => navigate("/build-cover-letter")
    },
    {
      icon: <Zap size={50} className="text-rose-500" />,
      title: "Quick Actions",
      desc1: "Access all your resumes and cover letters instantly.",
      desc2: "Streamlined workflow for job applications.",
      action: () => navigate("/view-resume")
    },
    {
      icon: <ShieldCheck size={50} className="text-cyan-500" />,
      title: "Data Privacy",
      desc1: "Your data stays encrypted and secure.",
      desc2: "We never sell your information.",
      action: null
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <Sparkles className="mx-auto text-blue-500 mb-4" size={60} />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl font-bold max-w-4xl"
        >
          Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.fullname || 'User'}</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 text-xl text-gray-600 max-w-2xl"
        >
          Ready to create your next career-winning resume? Let's build something amazing together.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-10 flex gap-4 flex-wrap justify-center"
        >
          <button
            onClick={() => navigate("/build-resume")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
          >
            Create Resume <ArrowRight size={20} />
          </button>
          <button
            onClick={() => navigate("/build-cover-letter")}
            className="bg-white text-gray-700 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg border"
          >
            Write Cover Letter <PenTool size={20} />
          </button>
        </motion.div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Build Resume", desc: "Create a new resume from scratch", icon: <FileText size={24} />, action: () => navigate("/build-resume"), color: "from-blue-500 to-blue-600" },
              { title: "View Resumes", desc: "Manage your existing resumes", icon: <MessageSquare size={24} />, action: () => navigate("/view-resume"), color: "from-emerald-500 to-emerald-600" },
              { title: "Cover Letters", desc: "Create compelling cover letters", icon: <PenTool size={24} />, action: () => navigate("/build-cover-letter"), color: "from-purple-500 to-purple-600" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={item.action}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105 border border-gray-100"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Everything You Need</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={f.action}
                className={`bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all ${f.action ? 'cursor-pointer transform hover:scale-105' : ''} border border-gray-100`}
              >
                <div className="mb-6">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{f.title}</h3>
                <p className="text-gray-600 mb-2">{f.desc1}</p>
                <p className="text-gray-500 text-sm">{f.desc2}</p>
                {f.action && (
                  <div className="mt-4 flex items-center text-blue-600 font-medium">
                    Try it now <ArrowRight size={16} className="ml-1" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">Why Choose RESUMIZER?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "AI-Powered Intelligence",
              "ATS-Friendly Templates", 
              "Industry-Specific Content",
              "Bank-Level Security",
              "Real-Time Collaboration",
              "24/7 Expert Support"
            ].map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <CheckCircle2 size={24} className="text-green-400 flex-shrink-0" />
                <span className="font-medium">{point}</span>
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold mb-6">Ready to Accelerate Your Career?</h2>
          <p className="mb-10 text-xl opacity-90">
            Join thousands who've landed their dream jobs with AI-powered resumes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button 
              onClick={() => navigate("/build-resume")}
              className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-50 transition-all transform hover:scale-105"
            >
              Start Building Now
            </button>
            <button 
              onClick={() => navigate("/view-resume")}
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all"
            >
              View My Resumes
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-gray-500 text-sm bg-white">
        © {new Date().getFullYear()} RESUMIZER. All rights reserved.
      </footer>
    </div>
  );
}
