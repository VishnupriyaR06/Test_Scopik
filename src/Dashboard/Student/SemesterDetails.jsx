import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function SemesterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [semester, setSemester] = useState(null);
  const [department, setDepartment] = useState("");
  const [university, setUniversity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_STUDENT_PROGRESS}?email=${userEmail}`
        );
        setUniversity(res.data.student.university);
        setDepartment(res.data.student.department);
      } catch (err) {
        setError("Failed to fetch department.");
        console.error(err);
      }
    };

    if (userEmail) {
      fetchDepartment();
    } else {
      setError("User email not found.");
    }
  }, [userEmail]);
  useEffect(() => {
    const fetchSemester = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_GETSEM_DETAILS}?department=${department}&university=${university}`
        );

        const semesterList = Array.isArray(res.data) ? res.data : [];

        const matchedSemester = semesterList.find(
          (s) => s?.sem?.toString() === id?.toString()
        );

        if (matchedSemester) {
          setSemester(matchedSemester);
        } else {
          setError("Semester not found.");
        }
      } catch (err) {
        setError("Failed to fetch semester details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (department && university) {
      fetchSemester();
    }
  }, [department, university, id]);

  const handleStartLearning = (subjectId) => {
    if (!semester?.start_date) return;

    const currentDate = new Date();
    const startDate = new Date(semester.start_date);

    if (currentDate < startDate) {
      setShowModal(true);
    } else {
      navigate(`/individual/${subjectId}`);
    }
  };
  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500 dark:text-gray-300">
        Loading semester details...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (!semester) {
    return null;
  }
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500 px-4 py-10 text-black dark:text-white">
    
      <div className="max-w-4xl mt-20 mx-auto">
        <button className="mb-5 bg-blue-700 p-3 text-white rounded-md dark:bg-orange-500" onClick={()=>{navigate(-1)}}>Back</button>
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 dark:text-orange-500 mb-4">
          Semester {semester.sem} Details
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Department: <strong>{semester.department}</strong> | Start Date:{" "}
          <strong>{semester.start_date}</strong>
        </p>
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-700 dark:text-orange-400 mb-4">
            Subjects
          </h2>

          {semester.subjects && semester.subjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {semester.subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
                >
                  <div className="h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                    <img
                      src={
                        subject.img
                          ? `${import.meta.env.VITE_BASE_URL}${subject.img}`
                          : `https://via.placeholder.com/400x200?text=${subject.name}`
                      }
                      alt={subject.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-blue-700 dark:text-orange-400 mb-2">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {subject.description}
                    </p>
                    <button
                      onClick={() => handleStartLearning(subject.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-300 dark:bg-orange-500 dark:hover:bg-orange-600"
                    >
                      Start Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No subjects listed.
            </p>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-80 text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Semester Not Yet Started
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Please wait until the start date ({semester.start_date}) to begin
              learning.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg dark:bg-orange-500 dark:hover:bg-orange-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
