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
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Professional Resume Builder
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Welcome back,
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {user?.fullname || 'Professional'}
              </span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
              Transform your career with AI-powered resumes that get you noticed by top employers
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/build-resume")}
                className="group relative px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <span className="flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  Create Resume
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button
                onClick={() => navigate("/build-cover-letter")}
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                <span className="flex items-center justify-center gap-2">
                  <PenTool className="w-5 h-5" />
                  Write Cover Letter
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <p className="text-xl text-gray-600">Everything you need to build your career</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Build Resume", 
                desc: "Create a professional resume with AI assistance", 
                icon: <FileText className="w-8 h-8" />, 
                action: () => navigate("/build-resume"), 
                gradient: "from-blue-600 to-blue-700",
                bg: "bg-blue-50",
                border: "border-blue-200"
              },
              { 
                title: "My Resumes", 
                desc: "View and manage your existing resumes", 
                icon: <MessageSquare className="w-8 h-8" />, 
                action: () => navigate("/view-resume"), 
                gradient: "from-emerald-600 to-emerald-700",
                bg: "bg-emerald-50",
                border: "border-emerald-200"
              },
              { 
                title: "Cover Letters", 
                desc: "Write compelling cover letters that get noticed", 
                icon: <PenTool className="w-8 h-8" />, 
                action: () => navigate("/build-cover-letter"), 
                gradient: "from-purple-600 to-purple-700",
                bg: "bg-purple-50",
                border: "border-purple-200"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                onClick={item.action}
                className={`group cursor-pointer bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${item.border} hover:border-opacity-50`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                <div className="mt-6 flex items-center text-gray-400 group-hover:text-gray-600 transition-colors">
                  <span className="text-sm font-medium">Get started</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create professional resumes that stand out from the competition
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {features.slice(0, 3).map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  onClick={f.action}
                  className={`group flex items-start gap-6 p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 ${f.action ? 'cursor-pointer' : ''}`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      {React.cloneElement(f.icon, { size: 24, className: "text-white" })}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{f.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{f.desc1}</p>
                    {f.action && (
                      <div className="mt-3 flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm">Try it now</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                <div className="space-y-6">
                  {features.slice(3).map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i + 3) * 0.1, duration: 0.6 }}
                      onClick={f.action}
                      className={`group flex items-start gap-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 ${f.action ? 'cursor-pointer' : ''}`}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                          {React.cloneElement(f.icon, { size: 20, className: "text-white" })}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{f.title}</h4>
                        <p className="text-white/80 text-sm">{f.desc1}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
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
