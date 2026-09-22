import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, ArrowRight } from "lucide-react";
import { TESTIMONIALS } from "../../data/merkatoContent";

interface CustomerTestimonialSectionProps {
  isDarkMode: boolean;
  onExploreCaseStudies: () => void;
}

export const CustomerTestimonialSection: React.FC<CustomerTestimonialSectionProps> = ({
  isDarkMode,
  onExploreCaseStudies,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section
      id="testimonials"
      className={`py-20 border-b transition-colors duration-200 ${
        isDarkMode
          ? "bg-zinc-950 border-zinc-800 text-white"
          : "bg-white border-zinc-100 text-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#E42528] mb-3">
              YOUR RELIABLE INVENTORY MANAGEMENT SOFTWARE
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Thousands of businesses prefer MERKATO STOCK
            </h2>
          </div>

          <button
            onClick={onExploreCaseStudies}
            className="self-start md:self-auto bg-[#E42528] hover:bg-[#c91d20] text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-md uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>EXPLORE CASE STUDIES</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Main Testimonial Card */}
        <div
          className={`p-5 sm:p-12 rounded-2xl sm:rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
            isDarkMode
              ? "bg-zinc-900/90 border-zinc-800"
              : "bg-[#FFFDF9] border-zinc-200/90"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Customer Photo Column */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-zinc-800 mb-4">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Company Logo Badge */}
              <div className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 font-black text-sm tracking-wider text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                {current.logo}
              </div>
            </div>

            {/* Testimonial Quote Column */}
            <div className="lg:col-span-8 space-y-6">
              <Quote className="w-12 h-12 text-[#E42528] fill-current opacity-80" />

              <blockquote className="text-lg sm:text-2xl font-bold leading-relaxed text-zinc-800 dark:text-zinc-100">
                "{current.quote}"
              </blockquote>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-black text-zinc-900 dark:text-white">
                    {current.name}
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {current.role}, <span className="font-semibold">{current.company}</span>
                  </div>
                </div>

                {/* Slider Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevTestimonial}
                    aria-label="Previous testimonial"
                    className="p-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-xs font-bold text-zinc-400 px-1">
                    {currentIndex + 1} / {TESTIMONIALS.length}
                  </span>
                  <button
                    onClick={nextTestimonial}
                    aria-label="Next testimonial"
                    className="p-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
