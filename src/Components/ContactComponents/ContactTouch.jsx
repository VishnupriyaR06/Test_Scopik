import { Mail, Phone, MapPin } from "lucide-react";
import backgroundImage from "/src/assets/bg/Group.png";

function GetInTouch() {
  return (
    <section
      className="relative bg-white dark:bg-black text-black dark:text-white transition-colors duration-300"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Top Shape Divider */}
      {/* <div className="relative -top-[90px] w-full overflow-hidden leading-[0] z-20">
        <svg
          className="relative block w-[calc(139%+1.3px)] h-[90px] rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,
               82.39-16.72,168.19-17.73,250.45-.39C823.78,31,
               906.67,72,985.66,92.83c70.05,18.48,146.53,
               26.09,214.34,3V0H0V27.35A600.21,600.21,
               0,0,0,321.39,56.44Z"
            className="fill-white dark:fill-black"
          />
        </svg>
      </div> */}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20 lg:py-24 relative z-10">
        <div className="bg-white/20 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-zinc-700 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] p-10 sm:p-14 space-y-10 transition-all duration-300">
          {/* Heading */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-orange-600 dark:text-orange-500">
              Let us help you
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our team is ready to assist you with course details, services, or
              support. Don't hesitate to connect - we're just a message away!
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid gap-8 md:grid-cols-3 text-center text-gray-800 dark:text-gray-200">
            {/* Phone */}
          <div className="flex flex-col items-center h-fit gap-4 p-6 bg-white/30 dark:bg-white/10 rounded-xl backdrop-blur-lg shadow-md transition hover:scale-105 hover:shadow-lg duration-300">
  <Phone className="w-9 h-9 text-orange-500" />
  <div className="space-y-1 text-base font-medium">
    <p>044-2842 2843</p>
    <a
      href="tel:+912374429424"
      className="hover:underline text-sm block"
    >
      +91 23744 29424
    </a>
  </div>
</div>
            
            {/* Address */}
            <div className="flex flex-col items-center gap-4 p-6 bg-white/30 dark:bg-white/10 rounded-xl backdrop-blur-lg shadow-md transition hover:scale-105 hover:shadow-lg duration-300">
              <MapPin className="w-9 h-9 text-orange-500" />
              <p className="text-base font-medium leading-relaxed">
                1st Floor, Amalpavi Office Complex,
                <br />
                Opp to National College,
                <br />
                Trichy-Dindigul Rd, Karumandapam,
                <br />
                Tiruchirappalli, Tamil Nadu - 620001
              </p>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center h-fit gap-4 p-6 bg-white/30 dark:bg-white/10 rounded-xl backdrop-blur-lg shadow-md transition hover:scale-105 hover:shadow-lg duration-300">
              <Mail className="w-9 h-9 text-orange-500" />
              <a
                href="mailto:support@scopik.in"
                className="hover:underline break-all text-base font-medium"
              >
                support@scopik.in
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default GetInTouch;
