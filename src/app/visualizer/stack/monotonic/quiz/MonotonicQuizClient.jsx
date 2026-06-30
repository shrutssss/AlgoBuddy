"use client";

import Link from "next/link";

const quizzes = [
  {
    title: "Largest Rectangle in Histogram Quiz",
    description:
      "Practice the Largest Rectangle in Histogram problem using Monotonic Stack.",
    href: "/visualizer/stack/monotonic/quiz/histogram",
    color: "bg-cyan-600 hover:bg-cyan-700",
  },
];

export default function MonotonicQuizClient() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-5xl font-bold text-center mb-4">
        📘 Monotonic Stack Quiz
      </h1>

      <p className="text-center text-gray-500 mb-10">
        Choose a Monotonic Stack quiz to test your understanding.
      </p>

      <div className="max-w-4xl mx-auto">
        {quizzes.map((quiz) => (
          <div
            key={quiz.title}
            className="border rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-2xl font-semibold mb-3">
              {quiz.title}
            </h2>

            <p className="mb-6 text-gray-600">
              {quiz.description}
            </p>

            <Link href={quiz.href}>
              <button
                className={`text-white px-5 py-3 rounded-lg ${quiz.color}`}
              >
                Start Quiz
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}