import { useNavigate } from "react-router-dom";

const Forbidden403 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-900 px-4">
      <h1 className="text-8xl font-extrabold text-red-600">403</h1>
      <h2 className="text-3xl md:text-4xl font-bold mt-4 text-gray-800 dark:text-white">
        Access Denied
      </h2>
      <p className="text-lg md:text-xl mt-2 text-gray-600 dark:text-gray-300 text-center max-w-md">
        Sorry, you don’t have permission to view this page. 
        Please check your account privileges or return to the homepage.
      </p>

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 rounded-lg bg-[#F97316] text-white hover:bg-orange-600 transition"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default Forbidden403;
