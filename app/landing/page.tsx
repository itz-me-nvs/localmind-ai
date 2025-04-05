'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-white via-blue-100 to-cyan-100 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/30 shadow-md border-b border-white/50">
  <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    <div className="text-3xl font-extrabold text-cyan-700 drop-shadow-lg">LocalMind AI</div>
    <nav className="space-x-6 text-lg">
      <Link href="#features" className="text-gray-900 hover:text-cyan-600 transition font-medium">Features</Link>
      <Link href="#demo" className="text-gray-900 hover:text-cyan-600 transition font-medium">Demo</Link>
      <Link href="/" className="bg-cyan-500 text-white px-5 py-2 rounded-full hover:bg-cyan-600 transition font-medium shadow-md">
        Get Started
      </Link>
    </nav>
  </div>
</header>

      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 drop-shadow-lg mb-6"
        >
          Supercharge Development with LocalMind AI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-xl text-gray-700 max-w-2xl"
        >
          Your all-in-one AI-powered dev assistant: code, test, document, and deploy faster than ever.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8"
        >
          <Link href="/" className="bg-cyan-500 text-white px-8 py-3 text-lg font-medium rounded-full hover:bg-cyan-600 transition">
            Get Started Now
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-12 backdrop-blur-md bg-white/50 p-2 rounded-2xl border border-white/70 shadow-xl"
        >
          <Image
            src="https://picsum.photos/800/400"
            alt="Demo preview"
            width={800}
            height={400}
            className="rounded-xl"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-cyan-700">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI-powered UI Generator",
                desc: "Create production-ready components instantly with Tailwind and ShadCN support.",
              },
              {
                title: "Test Case Generator",
                desc: "Generate unit tests for your code in seconds.",
              },
              {
                title: "Prompt Enhancer",
                desc: "Improve your prompts to get better LLM results.",
              },
              {
                title: "Local Context Chat",
                desc: "Chat with your own data and history securely.",
              },
              {
                title: "Developer Tools",
                desc: "Access JSON formatting, URL encoding, encryption tools and more in one place.",
              },
              {
                title: "AI Reading Assistant",
                desc: "Summarize or translate content from PDFs, YouTube, and social platforms.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/50 backdrop-blur-lg rounded-xl p-6 border border-white/60 shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-cyan-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-700">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-white/50 backdrop-blur-xl border-t border-white/60 text-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-cyan-700">Watch the Demo</h2>
          <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-xl border border-white/60">
            <iframe
              className="w-full h-96"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Demo Video"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-gray-600 border-t border-white/50 bg-white/30 backdrop-blur-md">
        © {new Date().getFullYear()} LocalMind AI. All rights reserved.
      </footer>
    </div>
  );
}
