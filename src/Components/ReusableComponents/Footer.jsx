import { Link, useLocation } from "react-router-dom";
import course from "../../assets/Footer/Course.png";
import Logo from "/src/assets/logo/NewLogo.png";
import home from "../../assets/Footer/Home.png";
import about from "../../assets/Footer/About.png";
import contact from "../../assets/Footer/Contact.png";
import blog from "../../assets/Footer/Blog.png";
import useTheme from "/src/Hooks/ThemeHook.js";

function Footer() {
  const isDarkMode = useTheme();
  const location = useLocation();

  let pathKey = location.pathname;
  if (location.pathname.startsWith("/course/")) pathKey = "/course";
const isHome = pathKey === "/";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? "#000000" : "#ffffff",
  };

  const textColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const mutedText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const hoverColor = "hover:text-orange-500";

  const picMap = {
    "/": {
      image: contact,
      text: "Empower your learning journey with our curated courses. Discover new skills and grow at your own pace. Join thousands of learners achieving their goals.",
      className: "absolute -bottom-[69px] right-6 lg:w-[35%]",
    },
    "/about": {
      image: about,
      text: "We make learning accessible and engaging for everyone. Our team is dedicated to helping you succeed. Be part of our growing community today.",
      className: "absolute -bottom-[75px] right-6 lg:w-[32%]",
    },
    "/privacy-policy/": {
      image: course,
      text: "We make learning accessible and engaging for everyone. Our team is dedicated to helping you succeed. Be part of our growing community today.",
      className: "absolute bottom-0 right-6 lg:w-[32%]",
    },
    "/terms-and-conditions/": {
      image: course,
      text: "We make learning accessible and engaging for everyone. Our team is dedicated to helping you succeed. Be part of our growing community today.",
      className: "absolute bottom-0 right-6 lg:w-[32%]",
    },
    "/refund_returns/": {
      image: course,
      text: "We make learning accessible and engaging for everyone. Our team is dedicated to helping you succeed. Be part of our growing community today.",
      className: "absolute bottom-0 right-6 lg:w-[32%]",
    },
    "/course": {
      image: course,
      text: "Explore courses designed to boost your skills and career. Learn from expert instructors and interactive lessons. Start your journey to mastery today.",
      className: "absolute bottom-0 right-6 lg:w-[38%]",
    },
    "/contact": {
      image: home,
      text: "Have questions or need support? We're here to help. Reach out via email or phone anytime. Your learning experience matters to us.",
      className: "absolute -bottom-[90px] right-6 lg:w-[30%]",
    },
    "/blog": {
      image: blog,
      text: "Stay updated with insights, tips, and tutorials. Learn from industry experts and improve your skills. Subscribe to our newsletter for the latest posts.",
      className: "absolute -bottom-14 right-6 lg:w-[34%]",
    },
  };

  const { text, image, className } = picMap[pathKey] || picMap["/"];

  return (
<div
  className={`relative z-20 ${isHome ? "" : "pt-[10%]"}`}
  style={backgroundStyle}
>
      {/* Banner Section */}
      <div className="w-full lg:pt-10 2xl:pt-5">
        <div className="block md:hidden h-1 w-full bg-orange-500"></div>
        <div className="hidden md:flex relative top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-700 w-[90%] h-[180px] rounded-xl justify-between items-center px-6 md:px-10 z-30 shadow-xl">
          <h1
            className="text-white font-medium text-base md:text-lg max-w-xl leading-relaxed"
            dangerouslySetInnerHTML={{ __html: text }}
          />
          <img
            src={image}
            alt="Illustration"
            className={`hidden lg:block drop-shadow-lg ${className}`}
          />
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative  lg:mt-0 pb-8 pl-5 md:px-20 z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 py-10 px-5 md:px-20 bg-gray-100 dark:bg-gray-900 rounded-lg">
          {/* Logo & About */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <Link to="/">
              <img src={Logo} className="w-24 md:w-28" alt="Logo" />
            </Link>
            <p className={`text-sm md:text-base font-normal xl:text-lg ${mutedText} max-w-lg leading-relaxed`}>
              Unlock your learning journey with Scopik. Quality education, anytime, anywhere. Designed to inspire, built for the future.
            </p>
          </div>

          {/* Links, Contact, Address */}
          <div className="w-full lg:w-1/2 flex flex-col md:flex-row md:gap-6 gap-10 mt-8 lg:mt-0">
            {/* Links */}
            <div className="text-sm md:text-base font-normal max-w-xs w-full mx-auto md:mx-0 flex-1">
              <h2 className="text-[#F97316] font-semibold text-lg md:text-xl mb-4 text-center md:text-left">
                Links
              </h2>
              <div className="grid grid-cols-2 gap-y-2 text-center md:text-left">
                <div className="flex flex-col gap-2">
                  <Link to="/" className={`${hoverColor} ${textColor} transition`}>Home</Link>
                  <Link to="/about" className={`${hoverColor} ${textColor} transition`}>About</Link>
                  <Link to="/course" className={`${hoverColor} ${textColor} transition`}>Course</Link>
                  <Link to="/contact" className={`${hoverColor} ${textColor} transition`}>Contact</Link>
                  <Link to="/blog" className={`${hoverColor} ${textColor} transition`}>Blog</Link>
                </div>
                <div className="flex flex-col gap-2">
                  <Link to="/privacy-policy/" className={`${hoverColor} ${textColor} transition`}>Privacy Policy</Link>
                  <Link to="/terms-and-conditions/" className={`${hoverColor} ${textColor} transition`}>Terms & Conditions</Link>
                  <Link to="/refund_returns/" className={`${hoverColor} ${textColor} transition`}>Refund Policy</Link>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="text-sm md:text-base font-normal max-w-xs w-full mx-auto md:mx-0 flex-1">
              <h2 className="text-[#F97316] font-semibold text-lg md:text-xl mb-4 text-center md:text-left">Contact</h2>
              <div className="flex flex-col gap-1 text-center md:text-left">
                <span className={`${mutedText}`}>044-2842 2843</span>
                <span className={`${mutedText}`}>+91 23744 29424</span>
              </div>
              <div className="mt-4">
                <h3 className="text-[#F97316] font-semibold text-md md:text-lg mb-1">Email</h3>
                <span className={`${mutedText}`}>support@scopik.in</span>
              </div>
            </div>

            {/* Address */}
            <div className="text-sm md:text-base font-normal max-w-xs w-full mx-auto md:mx-0 flex-1">
              <h2 className="text-[#F97316] font-semibold text-lg md:text-xl mb-4 text-center md:text-left">Address</h2>
              <p className={`${mutedText} leading-relaxed text-center md:text-left`}>
                1st Floor, Amalpavi Office Complex Opp to National College,
                Trichy-Dindigul Rd C Block, Karumandapam, Tiruchirappalli, Tamil Nadu 620001
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={`border-t mt-1 pt-4 flex flex-col md:flex-row justify-center md:justify-between items-center text-sm ${
        isDarkMode ? "border-gray-700 text-gray-500" : "border-gray-300 text-gray-500"
      }`}>
        <span>&copy; 2025 Scopik. All rights reserved.</span>
        <a
          href="https://thirdvizion.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 md:mt-0 text-gray-400 dark:text-orange-500 hover:text-orange-500 dark:hover:text-gray-400 transition"
        >
          Developed by Thirdvizion.com
        </a>
      </div>
    </div>
  );
}

export default Footer;
