import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function Student_details() {
  const [studentDetails, setStudentDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const user = import.meta.env.VITE_USER_NAME;
  const pass = import.meta.env.VITE_USER_PASS;

  const token = btoa(`${user}:${pass}`);

  useEffect(() => {
    fetchStudents();
  }, []);

  function fetchStudents() {
    axios
      .get(import.meta.env.VITE_STUDENT_DETAILS, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      })
      .then((res) => {
        setStudentDetails(res.data);
      });
  }

  const filteredStudents = studentDetails.filter((item) =>
    [item.name, item.email, item.department, item.university]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const dataToExport = () => {
    return filteredStudents.map((item, index) => ({
      S_no: index + 1,
      Name: item.name,
      Email: item.email,
      Department: item.department,
      Number: item.phone_number,
      Register_no: item.register_no || "Student By Scopik",
      University: item.university,
      Year: item.academic_year || "Student By Scopik",
      Courses:
        item.courses && item.courses.length > 0
          ? item.courses.map((c) => c.course_name).join(", ")
          : "No course Enrolled",

      Payment_info:
        item.payments && item.payments.length > 0
          ? item.payments.some((p) => p.status === true)
            ? "Success"
            : "Course Assigned by University"
          : "No Payment Found",

      Payment_Date:
        item.payments && item.payments.length > 0
          ? item.payments
              .map((d) => d.payment_date?.split("T")[0] || "—")
              .join(", ")
          : "",
    }));
  };

  function Reportdownload() {
    const worksheet = XLSX.utils.json_to_sheet(dataToExport());
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Overall Report");
    XLSX.writeFile(workbook, "Overall_Data.csv", { bookType: "csv" });
  }

  function toggleExpand(index) {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-orange-400">
          Students Report
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition w-full sm:w-auto"
            onClick={Reportdownload}
          >
            Export Report
          </button>
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full text-sm border border-gray-300 dark:border-gray-700">
          <thead className="bg-blue-600 dark:bg-gray-800">
            <tr>
              {[
                "S.No",
                "Name",
                "Email",
                "Department",
                "Register Number",
                "University",
                "Academic Year",
                "Phone Number",
                "Course Enrolled",
                "Payment Information",
                "Payment Date",
              ].map((header, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-center font-semibold tracking-wide text-white dark:text-orange-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((item, index) => {
              const courses =
                item.courses && item.courses.length > 0
                  ? item.courses.map((c) => c.course_name)
                  : [];

              const isExpanded = expandedRows[index];

              return (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-100 dark:bg-gray-700"
                  } hover:bg-blue-50 dark:hover:bg-gray-600 transition`}
                >
                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                    {item.name}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                    {item.email}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                    {item.department || "Student by Scopik"}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                    {item.registerno || "Student By Scopik"}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                    {item.university}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                    {item.academic_year || "Student By Scopik"}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                    {item.phone_number}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                    {courses.length === 0 ? (
                      "Course Not Enrolled"
                    ) : (
                      <>
                        {isExpanded
                          ? courses.join(", ")
                          : courses.slice(0, 2).join(", ")}

                        {courses.length > 2 && (
                          <button
                            onClick={() => toggleExpand(index)}
                            className="ml-2 text-blue-600 dark:text-orange-400 underline"
                          >
                            {isExpanded ? "Read less" : "Read more"}
                          </button>
                        )}
                      </>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                    {item.payments && item.payments.length > 0
                      ? item.payments.some((c) => c.status === true)
                        ? "Success"
                        : "Assigned By University"
                      : "Payment Not Done"}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-900 dark:text-gray-200">
                    {item.payments && item.payments.length > 0
                      ? item.payments
                          .map((c) => c.payment_date?.split("T")[0] || "—")
                          .join(", ")
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Student_details;
