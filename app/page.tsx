"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGetStarted = () => {
    setLoading(true);

    // Minimum 2 seconds loader
    setTimeout(() => {
      router.push("/auth/login");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
  <div className="flex flex-col items-center gap-4">
    <div className="flex gap-2">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className="w-3 h-3 bg-[#ED2400] rounded-full animate-[pulseBar_1.2s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
    <p className="text-gray-600 font-medium">Initializing...</p>

    <style jsx>{`
      @keyframes pulseBar {
        0%, 100% { height: 8px; opacity: 0.4; }
        50% { height: 28px; opacity: 1; }
      }
    `}</style>
  </div>
</div>

    );
  }

  return (
    <>
     
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <section className="max-w-4xl text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Streamline Your Team{" "}
            <span className="text-blue-600">Onboarding</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A centralized platform to assign tasks, track progress, and manage
            submissions with ease. Whether you are an Admin or a User, TaskFlow
            keeps your workflow organized.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition"
            >
              Get Started
            </button>

            <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition">
              Learn More
            </button>
          </div>
        </section>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
          <FeatureCard
            title="Task Management"
            desc="Assign tasks with deadlines and clear descriptions."
          />
          <FeatureCard
            title="Real-time Tracking"
            desc="Monitor submission status from assigned to approved."
          />
          <FeatureCard
            title="Secure Storage"
            desc="Upload screenshots and repo links directly to Firebase."
          />
        </div>
      </main>
    </>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-500">{desc}</p>
    </div>
  );
}
