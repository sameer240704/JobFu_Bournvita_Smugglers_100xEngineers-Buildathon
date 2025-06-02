import React, { useState, useEffect } from "react";

const FloatingCandidateCarousel = () => {
  const candidates = [
    {
      name: "Sara Deshmukh",
      title: "Computer Vision Specialist",
      location: "Bangalore, India",
      experience: "7+ years",
      company: "Ex-Google Brain",
      match: 95,
      skills: ["Computer Vision", "Deep Learning", "TensorFlow"],
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq7D0gRvChNmILuoqSqH4bq0QHqwJ5UBYBMQ&s",
    },
    {
      name: "Alex Morgan",
      title: "Senior Gen-AI Engineer",
      location: "London, UK",
      experience: "5+ years",
      company: "Ex-OpenAI",
      match: 98,
      skills: ["LangChain", "RAG Systems", "LLM Optimization"],
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRflU8JsR2zswnq5cOLcdio3reTYypQbTZbjA&s",
    },
    {
      name: "Taylor Chen",
      title: "NLP Research Engineer",
      location: "Remote",
      experience: "4+ years",
      company: "PhD in NLP",
      match: 92,
      skills: ["NLP", "Transformers", "BERT"],
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFWSdLx6CN18IuNptXM7AYNXP2rcGtvcWkEw&s",
    },
    {
      name: "Casey Smith",
      title: "MLOps Engineer",
      location: "Toronto, Canada",
      experience: "6+ years",
      company: "ML Infrastructure",
      match: 90,
      skills: ["MLOps", "Kubernetes", "AWS"],
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpOrZa0bsHyQC11WseJzR_2wrc_aRgVQ8QwA&s",
    },
    {
      name: "Rahul Shah",
      title: "AI Product Manager",
      location: "Seattle, USA",
      experience: "8+ years",
      company: "Ex-Meta AI",
      match: 88,
      skills: ["Product Strategy", "AI Roadmapping"],
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUOwoGvZ0GuNg1WBvKJsvQ9YFtAduBUMRwSA&s",
    },
    {
      name: "Sam Wilson",
      title: "Machine Learning Engineer",
      location: "Berlin, Germany",
      experience: "5+ years",
      company: "Ex-DeepMind",
      match: 94,
      skills: ["PyTorch", "Neural Networks", "MLOps"],
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgi5_Ve8ipLl0R3oW4GBzThw-1_Hk8TB1riA&s",
    },
  ];

  const [translateX, setTranslateX] = useState(0);

  const duplicatedCandidates = [...candidates, ...candidates, ...candidates];

  useEffect(() => {
    const speed = 1;
    const cardWidth = 320;
    const resetPoint = candidates.length * cardWidth;

    const animate = () => {
      setTranslateX((prev) => {
        const newX = prev - speed;

        return newX <= -resetPoint ? 0 : newX;
      });
    };

    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [candidates.length]);

  const CandidateCard = ({ candidate }) => (
    <div className="flex-shrink-0 w-80 mx-2 group">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 h-[83%] border border-white/20 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/90 dark:hover:bg-gray-700/90">
        <div className="flex justify-between items-start mb-3 gap-1">
          <div className="flex-1 text-start overflow-hidden">
            <h3 className="font-bold text-gray-800 dark:text-white text-lg leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
              {candidate.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
              {candidate.location}
            </p>
          </div>
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
            {candidate.match}% match
          </div>
        </div>

        <div className="flex items-center mb-5">
          <div className="relative">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="w-14 h-14 rounded-full object-cover border-3 border-white dark:border-gray-800 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          <div className="ml-4 flex-1">
            <p className="font-bold text-gray-800 dark:text-white text-lg">
              {candidate.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {candidate.experience} • {candidate.company}
            </p>
          </div>
        </div>

        <div className="flex flex-nowrap overflow-x-auto pb-2 mb-6 gap-2 no-scrollbar overflow-hidden">
          {candidate.skills.map((skill, index) => (
            <span
              key={index}
              className="flex-shrink-0 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 text-purple-700 dark:text-purple-300 text-xs px-3 py-1 rounded-full font-medium border border-purple-200 dark:border-purple-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-purple-50 via-indigo-50 to-teal-50 dark:from-gray-900 dark:via-indigo-900/10 dark:to-indigo-950">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-purple-50 via-purple-50/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 z-10 pointer-events-none"></div>

      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-purple-50 via-purple-50/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 z-10 pointer-events-none"></div>

      <div className="flex overflow-hidden">
        <div
          className="flex transition-none"
          style={{
            transform: `translateX(${translateX}px)`,
            width: "max-content",
          }}
        >
          {duplicatedCandidates.map((candidate, index) => (
            <CandidateCard key={index} candidate={candidate} />
          ))}
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-300/30 dark:bg-purple-700/30 rounded-full animate-pulse"
            style={{
              top: `${20 + i * 12}%`,
              left: `${10 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.3}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FloatingCandidateCarousel;
