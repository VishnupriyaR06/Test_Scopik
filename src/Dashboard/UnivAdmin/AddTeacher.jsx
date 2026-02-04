import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import useTheme from "/src/Hooks/ThemeHook"; // Assuming a useTheme hook exists
import { FaUserPlus, FaCheckCircle, FaTimesCircle, FaUpload } from "react-icons/fa";
import { AlertTriangle } from "lucide-react";

function AddTeacher() {
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [uploadType, setUploadType] = useState(null);
  const uniName = localStorage.getItem("univName");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [univ, setUniv] = useState(uniName);
  const [phone, setPhone] = useState("");
  const [dept, setDept] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [course, setCourse] = useState([]);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [bulkUsers, setBulkUsers] = useState([]);
  const [sub, setSub] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalIcon, setModalIcon] = useState(null);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [search, setSearch] = useState("");

  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filterDept, setFilterDept] = useState("");

  const isDarkMode = useTheme();

  const user_type = "Faculty";
  const Email = localStorage.getItem("userEmail");


  const inputStyle = `w-full p-2 border rounded outline-none ${
    isDarkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"
  } focus:ring-2 focus:ring-blue-500`;
  const btnStyle = "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition";

  useEffect(() => {
    fetchTeachers();
    fetchCourses();
  }, []);

  const fetchTeachers = () => {
    axios
      .get(import.meta.env.VITE_UNIVERSITY_FACULTY, {
        params: { email: Email },
      })
      .then((res) => setTeachers(res.data))
      .catch((err) => console.error(err));
  };

  const fetchCourses = () => {
    axios
      .get(import.meta.env.VITE_UNIVERSITY_COURSE, {
        params: { email: Email },
      })
      .then((res) => setCourse(res.data))
      .catch((err) => console.error(err));
  };

  const openModal = (message, icon) => {
    setModalMessage(message);
    setModalIcon(icon);
    setShowModal(true);
  };

  const handleDelete = (teacherEmail) => {
    axios
      .delete(`${import.meta.env.VITE_FACULTY_DELETE}${teacherEmail}`)
      .then(() => {
        setTeachers((prev) => prev.filter((t) => t.email !== teacherEmail));
        openModal(
          "Teacher deleted successfully!",
          <FaCheckCircle className="text-green-500" size={40} />
        );
      })
      .catch(() => {
        openModal("Error deleting teacher.", <FaTimesCircle className="text-red-500" size={40} />);
      });
  };

  const addTeacher = () => {
    axios
      .post(import.meta.env.VITE_REGISTER, {
        name,
        email,
        user_type,
        university: univ,
        phone,
        department: dept,
      })
      .then(() => {
        setName("");
        setEmail("");
        setUniv("");
        setPhone("");
        setDept("");
        setShowUploadOptions(false);
        setTeachers((prev) => [...prev, { name, email, university: univ, department: dept }]);
        openModal(
          "Teacher registered successfully! Please Check Email for Other Details..!",
          <FaCheckCircle className="text-green-500" size={40} />
        );
      })
      .catch(() => {
        openModal("Error registering teacher.", <FaTimesCircle className="text-red-500" size={40} />);
      });
  };

  const bulkFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      const workbook = XLSX.read(ev.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const detail = XLSX.utils.sheet_to_json(sheet, { header: "A" });
      const facultyDetails = detail
        .filter(
          (item) =>
            item.B && item.C && item.D && item.E && item.F && typeof item.A === "number"
        )
        .map((item) => ({
          name: item.B,
          email: item.C,
          department: item.D,
          university: item.E,
          phone: String(item.F || ""),
          user_type: "Faculty",
        }));
      setBulkUsers(facultyDetails);
      setSub(true);
    };
    reader.readAsArrayBuffer(file);
  };

  const submitBulkUsers = async () => {
    if (!bulkUsers.length) {
      openModal("No data to upload.", <AlertTriangle className="text-yellow-500" size={40} />);
      return;
    }
    try {
      await axios.post(
        "https://lms.scopik.in/api/bulkupload/",
        { users: bulkUsers }
      );
      setBulkUsers([]);
      setSub(false);
      openModal("Bulk faculty registration successful!", <FaCheckCircle className="text-green-500" size={40} />);
      fetchTeachers();
    } catch {
      openModal("Error in bulk upload.", <FaTimesCircle className="text-red-500" size={40} />);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setSelectedCourses([]);
  };

  const addCourseToSelection = (courseName) => {
    if (courseName && !selectedCourses.includes(courseName)) {
      setSelectedCourses((prev) => [...prev, courseName]);
    }
  };

  const removeCourse = (courseName) =>
    setSelectedCourses((prev) => prev.filter((c) => c !== courseName));

  const assignCoursesToTeacher = () => {
    if (!editingTeacher || !selectedCourses.length) {
      openModal(
        "Please select at least one course to assign.",
        <AlertTriangle className="text-yellow-500" size={40} />
      );
      return;
    }
    axios
      .post("https://lms.scopik.in/api/assigncoursetofaculty/", {
        faculty_email: editingTeacher.email,
        course_name: selectedCourses,
        university: uniName,
      })
      .then(() => {
        setEditingTeacher(null);
        setSelectedCourses([]);
        openModal("Courses assigned successfully!", <FaCheckCircle className="text-green-500" size={40} />);
      })
      .catch(() => {
        openModal("Failed to assign courses.", <FaTimesCircle className="text-red-500" size={40} />);
      });
  };

  const toggleSelectTeacher = (teacher) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacher) ? prev.filter((t) => t !== teacher) : [...prev, teacher]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(filteredTeachers);
    }
    setSelectAll(!selectAll);
  };

  const exportSelected = () => {
    if (!selectedTeachers.length) {
      openModal("No teachers selected to export.", <AlertTriangle className="text-yellow-500" size={40} />);
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(selectedTeachers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected_Teachers");
    XLSX.writeFile(workbook, "selected_teachers.csv");
  };

  const filteredTeachers = teachers
    .filter((t) => (filterDept ? t.department === filterDept : true))
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  const departmentList = [...new Set(teachers.map((t) => t.department).filter(Boolean))];

 return (
  <div
    className={`w-full min-h-screen px-2 sm:px-4 py-6 sm:py-8 rounded-lg ${
      isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-800"
    }`}
  >
    <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 mb-4">
      <h1 className="text-xl sm:text-2xl font-bold">FACULTY DETAILS</h1>
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <button
          onClick={() => setShowUploadOptions(!showUploadOptions)}
          className={`${btnStyle} flex items-center justify-center gap-2`}
        >
          <FaUserPlus /> {showUploadOptions ? "Hide Add Faculty" : "Add Faculty"}
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded border w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

   {/* Upload Section */}
{showUploadOptions && (
  <div
    className={`shadow-lg rounded-lg p-3 sm:p-6 mb-6 ${
      isDarkMode ? "bg-slate-800" : "bg-white"
    }`}
  >
    {/* Toggle between Single / Bulk Upload */}
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <button
        onClick={() => setUploadType("single")}
        className={`w-full sm:flex-1 py-2 rounded flex items-center justify-center gap-2 text-sm sm:text-base ${
          uploadType === "single"
            ? "bg-purple-600 text-white"
            : "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300"
        }`}
      >
        <FaUserPlus /> Single Upload
      </button>
      <button
        onClick={() => setUploadType("bulk")}
        className={`w-full sm:flex-1 py-2 rounded flex items-center justify-center gap-2 text-sm sm:text-base ${
          uploadType === "bulk"
            ? "bg-green-600 text-white"
            : "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300"
        }`}
      >
        <FaUpload /> Bulk Upload
      </button>
    </div>

    {/* Single Upload Form */}
    {uploadType === "single" && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className={`${inputStyle} text-sm sm:text-base`}
        />
        <input
          type="text"
          value={univ}
          placeholder="University Name"
          className={`${inputStyle} text-sm sm:text-base`}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email ID"
          className={`${inputStyle} text-sm sm:text-base`}
        />
        <input
          type="tel"
          maxLength={10}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          className={`${inputStyle} text-sm sm:text-base`}
        />
        <input
          type="text"
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          placeholder="Department"
          className={`${inputStyle} text-sm sm:text-base`}
        />
        <button
          onClick={addTeacher}
          className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
        >
          Register
        </button>
      </div>
    )}

    {/* Bulk Upload */}
    {uploadType === "bulk" && (
      <div className="flex flex-col gap-3">
        <p
          className={`text-xs sm:text-sm ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Upload Excel with: <b>SrNo (A)</b>, <b>Name (B)</b>,{" "}
          <b>Email (C)</b>, <b>Department (D)</b>, <b>University (E)</b>,{" "}
          <b>Phone (F)</b>
        </p>
        <input
          type="file"
          onChange={bulkFile}
          className={`border border-dashed border-blue-400 p-3 sm:p-5 rounded cursor-pointer text-xs sm:text-sm transition ${
            isDarkMode
              ? "bg-slate-800 text-gray-300 hover:bg-slate-700"
              : "bg-white hover:bg-blue-50 text-gray-700"
          }`}
        />
        <button
          onClick={submitBulkUsers}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm sm:text-base"
        >
          {sub ? "Submit" : "Upload"}
        </button>
      </div>
    )}
  </div>
)}
    <div
      className={`rounded-lg shadow p-4 sm:p-6 ${
        isDarkMode ? "bg-slate-800" : "bg-white"
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold dark:text-white">
          Faculty Members
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white w-full sm:w-auto"
          >
            <option value="">All Departments</option>
            {departmentList.map((d, idx) => (
              <option key={idx} value={d}>
                {d}
              </option>
            ))}
          </select>
          <button
            onClick={exportSelected}
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      {filteredTeachers.length > 0 && (
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={toggleSelectAll}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="dark:text-white text-sm">Select All</span>
        </div>
      )}

      <div className="h-full overflow-y-auto">
        {filteredTeachers.length === 0 ? (
          <p className="text-gray-500 text-center dark:text-gray-300">
            No faculty data available.
          </p>
        ) : (
          filteredTeachers.map((t, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row justify-between sm:items-center border-b py-3 text-gray-800 dark:text-white text-sm sm:text-base"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedTeachers.includes(t)}
                  onChange={() => toggleSelectTeacher(t)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="font-medium">{t.name}</span>
                <span className="text-xs text-gray-500">
                  ({t.department})
                </span>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                  onClick={() => handleEdit(t)}
                >
                  Assign
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>

    {/* Assign Modal */}
    {editingTeacher && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg max-w-lg w-full">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Assign Courses to {editingTeacher.name}
          </h3>
          <select
            onChange={(e) => addCourseToSelection(e.target.value)}
            className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Course</option>
            {course.map((c, idx) => (
              <option key={idx} value={c.course_name}>
                {c.course_name}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedCourses.map((courseName, idx) => (
              <span
                key={idx}
                className="bg-blue-200 dark:bg-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {courseName}
                <button
                  onClick={() => removeCourse(courseName)}
                  className="text-red-600 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <button
              onClick={() => setEditingTeacher(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={assignCoursesToTeacher}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Alert Modal */}
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-2">
        <div
          className={`p-6 rounded-lg shadow-lg w-full max-w-sm text-center ${
            isDarkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          {modalIcon}
          <p className="mt-3 mb-4 text-lg">{modalMessage}</p>
          <button
            onClick={() => setShowModal(false)}
            className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            OK
          </button>
        </div>
      </div>
    )}
  </div>
);

}

export default AddTeacher;
