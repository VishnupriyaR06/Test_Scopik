import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import mark from "/src/assets/FAQ/question.png";
import lightBG from "../../assets/newImage/img1.png";
import darkBG from "../../assets/newImage/img2.png";
import useTheme from "/src/Hooks/ThemeHook.js";

const FAQItem = ({ question, answer, isOpen, onClick, isDarkMode }) => {
  return (
    <div
      className={`rounded-2xl shadow-lg border transition-all duration-300 overflow-hidden w-full ${
        isDarkMode ? "bg-white/10 border-white/20" : "bg-white border-gray-200"
      }`}
    >
      <button
        onClick={onClick}
        className={`w-full flex justify-between items-center py-3 px-6 text-left focus:outline-none transition-colors duration-200 ${
          isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-50"
        }`}
      >
        <span
          className={`font-semibold text-lg md:text-xl ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {question}
        </span>
        <span className="text-[#FF8011] transition-transform duration-300">
          {isOpen ? <Minus size={24} /> : <Plus size={24} />}
        </span>
      </button>
      <div
        className={`px-6 text-base md:text-lg leading-relaxed transition-all duration-300 ease-in-out ${
          isOpen ? "h-auto pb-5 opacity-100" : "h-0 opacity-0"
        } overflow-hidden ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
      >
        {answer}
      </div>
    </div>
  );
};

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const isDarkMode = useTheme();

  const backgroundImage = isDarkMode ? darkBG : lightBG;
  const containerOverlay = isDarkMode ? "bg-black/50" : "";

  const faqs = [
    {
      question: "Who can enroll in the courses?",
      answer:
        "Anyone with a passion to learn can join � no prior experience required. We offer beginner to advanced-level content for all learners.",
    },
    {
      question: "Do I get a certificate after course completion?",
      answer:
        "Yes, a digital certificate is awarded upon successful completion. You can download and share it on LinkedIn or your resume.",
    },
    {
      question: "Do I need prior experience?",
      answer: "No experience is needed. Classes are suitable for all levels.",
    },
    {
      question: "Are the courses self-paced or live?",
      answer:
        "Most courses are self-paced with pre-recorded videos. Some may include live sessions or instructor Q&As depending on the course.",
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="w-full py-16 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 bg-no-repeat bg-cover dark:bg-black"
    >
      <div
        className={`rounded-2xl shadow-inner w-full py-10 px-6 backdrop-blur-sm ${containerOverlay} overflow-hidden`}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 w-full">
          <div className="lg:w-1/2 w-full">
            <h2
              className={`text-lg md:text-xl font-news mb-2 uppercase tracking-wide ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              #FAQs
            </h2>
            <h1 className="text-[#F97316] text-3xl md:text-4xl xl:text-5xl font-bold font-news mb-4 leading-snug">
              Frequently Asked Questions
            </h1>
            <p
              className={`text-base sm:text-lg lg:text-xl mb-6 leading-relaxed ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Find quick answers to the most common questions, browse below to
              get the information you need fast.
            </p>
            <img
              src={mark}
              alt="question mark"
              className="hidden sm:block w-24 sm:w-36 lg:w-36 xl:w-48 mt-4 ml-36"
            />
          </div>
          <div className="lg:w-1/2 w-full flex flex-col gap-6">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
