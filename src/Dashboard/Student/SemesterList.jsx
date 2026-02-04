import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react"

export default function SemesterList() {
  const [semesters, setSemesters] = useState([]);
  const [department, setDepartment] = useState("");
  const [university, setUniversity] = useState("");
  const Uemail = localStorage.getItem("userEmail");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_STUDENT_PROGRESS}?email=${Uemail}`)
      .then((res) => {
        setUniversity(res.data.student.university);
        setDepartment(res.data.student.department);
      })
      .catch((err) => {
        console.error("Error fetching student department:", err);
      });
  }, []);

  useEffect(() => {
    if (department) {
      axios
        .get(
          `${import.meta.env.VITE_GETSEM_DETAILS}?department=${department}&university=${university}`
        )
        .then((res) => {
          console.log(res.data)
          setSemesters(res.data);
        })
        .catch((err) => {
          console.error("Error fetching syllabus:", err);
        });
    }
  }, [department]);

  return (
    <div className="p-8 bg-white dark:bg-black min-h-screen transition-colors duration-500">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-orange-500 mb-6 flex items-center gap-2">
        <BookOpen className="w-6 h-6" /> Semester List
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {semesters.map((semester) => (
          <div
            key={semester.id}
            className="bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl overflow-hidden shadow hover:shadow-orange-500/40 transition duration-300"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-blue-700 dark:text-orange-500 mb-2">
                Semester {semester.sem}
              </h2>
<p className="text-gray-700 dark:text-gray-300 text-sm">
  Subjects: {semester.subjects?.map(sub => sub.name).join(", ") || "N/A"}
</p>

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <strong>Start Date:</strong> {semester.start_date}
              </p>
              <Link
                to={`/semesters/${semester.sem}`}
                className="mt-4 inline-flex items-center gap-1 text-blue-600 dark:text-orange-400 hover:underline font-semibold"
              >
                Read More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
