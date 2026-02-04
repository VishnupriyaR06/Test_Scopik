
import { Users, BadgeCheck, BookOpen, User } from "lucide-react";

function Stats() {
  const stats = [
    {
      icon: <Users className="text-[#FF6A00] size-20 mb-2 font-news" />,
      title: "12,836",
      subtitle: "Students",
    },
    {
      icon: <BadgeCheck className="text-[#FF6A00] size-20 mb-2 font-news" />,
      title: "Certificate",
      subtitle: "Provided",
    },
    {
      icon: <BookOpen className="text-[#FF6A00] size-20 mb-2 font-news" />,
      title: "Detailed",
      subtitle: "Classes",
    },
    {
      icon: <User className="text-[#FF6A00] size-20 mb-2 font-news" />,
      title: "Professional",
      subtitle: "Staffs",
    },
  ];
  return (
    <div className="py-10 px-4 text-center pt-10 pb-10 bg-white dark:bg-black transition-colors duration-500">
      <h2 className="text-4xl md:text-5xl xl:text-5xl mt-5  font-news text-center text-black dark:text-gray-300">
        Know About The <span className="text-[#F97316]">Scopik</span>
      </h2>

      <div className="grid gap-10 mt-20 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto px-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white/80 dark:bg-[#1a1a1a] hover:bg-orange-50 dark:hover:bg-[#222] transition-all duration-300 rounded-xl p-6 flex flex-col items-center shadow-lg hover:scale-105 group"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="text-[#FF6A00] text-4xl">{item.icon}</div>
              <h4 className="text-orange-500 dark:text-[#FF6A00] text-3xl font-bold font-news mb-1">
                {item.title}
              </h4>
              <p className="text-gray-800 dark:text-gray-200 font-news text-lg">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Stats;
