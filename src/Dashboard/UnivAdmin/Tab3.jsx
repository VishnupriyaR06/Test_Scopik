import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import useTheme from "/src/Hooks/ThemeHook";
import { FaUserPlus, FaCheckCircle, FaTimesCircle, FaUpload } from "react-icons/fa";
import { AlertTriangle } from "lucide-react";

function Teacherthird() {
  const [search, setSearch] = useState("");
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [student, setStudent] = useState([]);
  const [uploadType, setUploadType] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // lowercase handled below
  const [phone, setPhone] = useState("");
  const [registerNo, setRegisterNo] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [academic, setAcademic] = useState("");
  const [department, setDepartment] = useState("");
  const [bulkUsers, setBulkUsers] = useState([]);
  const [sub, setSub] = useState(false);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedStudentEmails, setSelectedStudentEmails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIcon, setModalIcon] = useState(null);

  const isDarkMode = useTheme();

  const inputStyle = `p-2 border rounded outline-none ${
    isDarkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"
  } focus:ring-2 focus:ring-blue-500`;
  const btnStyle = "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition";

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    const Email = localStorage.getItem("userEmail");
    axios
      .get(import.meta.env.VITE_UNIVERSITY_STUDENT, {
        params: { email: Email },
      })
      .then((res) => setStudent(res.data))
      .catch((err) => console.error("Error", err));
  };

  const handleAddStudentClick = () => {
    setShowUploadOptions(!showUploadOptions);
    setUploadType(null);
  };

  const openModal = (message, icon) => {
    setModalMessage(message);
    setModalIcon(icon);
    setShowModal(true);
  };

  const filteredStudents = student
    .filter(
      (s) => selectedYear === "all" || s.academic_year === parseInt(selectedYear)
    )
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const handleStudentCheckbox = (email) => {
    setSelectedStudentEmails((prevSelected) =>
      prevSelected.includes(email)
        ? prevSelected.filter((e) => e !== email)
        : [...prevSelected, email]
    );
  };

  const bulkFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const detail = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const studentDetails = detail
        .filter(
          (item) =>
            item.B && item.C && item.D && item.E && item.F && typeof item.A === "number"
        )
        .map((item) => ({
          name: item.C,
          email: item.D.toLowerCase(), // lowercasing here
          phone: String(item.G || ""),
          registerno: item.B,
          university: item.E,
          academicYear: item.F,
          department: item.H,
          user_type: "student",
        }));
      setBulkUsers(studentDetails);
      setSub(true);
    };
    reader.readAsArrayBuffer(file);
  };

  const submitBulkUsers = async () => {
    if (!bulkUsers.length) {
      openModal(
        "No data to upload.",
        <AlertTriangle className="text-yellow-500" size={40} />
      );
      return;
    }
    try {
      await axios.post(import.meta.env.VITE_BULK_UPLOAD, { users: bulkUsers });
      openModal(
        "Bulk registration successful!",
        <FaCheckCircle className="text-green-500" size={40} />
      );
      fetchStudents();
      setBulkUsers([]);
      setSub(false);
    } catch (error) {
      console.error("Upload error:", error);
      openModal(
        "Error in bulk upload.",
        <FaTimesCircle className="text-red-500" size={40} />
      );
    }
  };

  const resetSingleForm = () => {
    setName("");
    setPhone("");
    setAcademic("");
    setEmail("");
    setRegisterNo("");
    setDepartment("");
    setUniversityName("");
  };

  const singleUpload = async () => {
    if (!name || !email || !registerNo || !universityName || !academic || !department || !phone) {
      openModal(
        "Please fill all fields.",
        <AlertTriangle className="text-yellow-500" size={40} />
      );
      return;
    }
    try {
      await axios.post(import.meta.env.VITE_REGISTER, {
        name,
        email: email.toLowerCase(), 
        user_type: "student",
        department,
        registerno: registerNo,
        university: universityName,
        academicYear: academic,
        phone,
      });
      openModal(
        "Student registered successfully!",
        <FaCheckCircle className="text-green-500" size={40} />
      );
      fetchStudents();
      resetSingleForm();
    } catch (err) {
      console.error("Error", err);
      openModal(
        "Failed to register student.",
        <FaTimesCircle className="text-red-500" size={40} />
      );
    }
  };

 const handleExportCSV = () => {
  const studentsToExport = selectedStudentEmails.length > 0
    ? filteredStudents.filter((stu) => selectedStudentEmails.includes(stu.email))
    : filteredStudents;

  if (!studentsToExport.length) {
    openModal(
      "No students selected or available to export.",
      <AlertTriangle className="text-yellow-500" size={40} />
    );
    return;
  }

  const dataToExport = studentsToExport.map((stu) => ({
    Name: stu.name || "",
    Email: stu.email || "",
    Phone: stu.phone_number || stu.phone || "",
    RegisterNumber: stu.registerno || "",
    University: stu.University || "",
    AcademicYear: stu.academicYear || stu.academic_year || "",
    Department: stu.department || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Students");
  XLSX.writeFile(workbook, "selected_students_export.csv", {
    bookType: "csv",
  });
};


  const handleSelectedDelete = async () => {
    if (selectedStudentEmails.length === 0) {
      openModal(
        "No students selected to delete.",
        <AlertTriangle className="text-yellow-500" size={40} />
      );
      return;
    }

    try {
      const response = await axios.delete(
        "https://lms.scopik.in/api/studentdelete/",
        {
          data: {
            select_all: false,
            selected_name: selectedStudentEmails,
          },
        }
      );

      openModal(
        response.data.message || "Selected students deleted successfully.",
        <FaCheckCircle className="text-green-500" size={40} />
      );

      const updatedStudentList = student.filter(
        (stu) => !selectedStudentEmails.includes(stu.email)
      );
      setStudent(updatedStudentList);
      setSelectedStudentEmails([]);
    } catch (err) {
      console.error("Error deleting students:", err?.response?.data || err.message);
      openModal(
        "Failed to delete selected students.",
        <FaTimesCircle className="text-red-500" size={40} />
      );
    }
  };

  const renderStudents = () => {
    if (filteredStudents.length === 0) {
      return (
        <p className="text-center mt-10 text-gray-500">No students found.</p>
      );
    }
    return (
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={
                filteredStudents.length > 0 &&
                selectedStudentEmails.length === filteredStudents.length
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedStudentEmails(filteredStudents.map((s) => s.email));
                } else {
                  setSelectedStudentEmails([]);
                }
              }}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <label className="text-sm text-gray-700 dark:text-gray-300">Select All</label>
            {selectedStudentEmails.length > 0 && (
              <div className="text-sm ml-6 text-gray-700 dark:text-gray-300">
                {selectedStudentEmails.length} student(s) selected
              </div>
            )}
          </div>
          {selectedStudentEmails.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleExportCSV}
                className="bg-green-600 text-white text-sm px-3 py-1 rounded-full hover:bg-green-700"
              >
                Export CSV
              </button>
              <button
                onClick={handleSelectedDelete}
                className="bg-red-600 text-white text-sm px-3 py-1 rounded-full hover:bg-red-700"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
        {filteredStudents.map((stu, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border-b py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition"
          >
            <input
              type="checkbox"
              checked={selectedStudentEmails.includes(stu.email)}
              onChange={() => handleStudentCheckbox(stu.email)}
              onClick={(e) => e.stopPropagation()}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <div className="flex flex-col gap-1 w-full">
              <span className="text-base font-medium text-gray-800 dark:text-white">
                {index + 1}. {stu.name}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{stu.email}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

return (
  <div
    className={`w-full rounded-xl min-h-screen px-4 py-6 ${
      isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-800"
    }`}
  >
    {/* Header Section */}
    <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
      <h1 className="text-2xl font-bold w-full md:w-auto text-center md:text-left">
        STUDENT DETAILS
      </h1>

      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <button
          onClick={handleAddStudentClick}
          className={`${btnStyle} flex items-center justify-center gap-2 w-full sm:w-auto`}
        >
          <FaUserPlus />{" "}
          {showUploadOptions ? "Hide Add Student" : "Add Student"}
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

    {/* Year Filters */}
    <div className="flex overflow-x-auto md:justify-end gap-2 mb-4 pb-1">
      {["all", "1", "2", "3"].map((year) => (
        <button
          key={year}
          onClick={() => setSelectedYear(year)}
          className={`px-4 py-2 flex-shrink-0 rounded-full text-sm transition ${
            selectedYear === year
              ? "bg-blue-600 text-white"
              : "bg-white border text-gray-700 hover:bg-blue-50 dark:bg-slate-800 dark:text-white"
          }`}
        >
          {year === "all" ? "All" : `${year} Year`}
        </button>
      ))}
    </div>

    {/* Upload Options */}
    {showUploadOptions && (
      <div
        className={`shadow-lg rounded-lg p-5 mb-6 ${
          isDarkMode ? "bg-slate-800" : "bg-white"
        }`}
      >
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <button
            onClick={() => setUploadType("single")}
            className={`flex-1 py-2 rounded flex items-center justify-center gap-2 ${
              uploadType === "single"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300"
            }`}
          >
            <FaUserPlus /> Single Upload
          </button>
          <button
            onClick={() => setUploadType("bulk")}
            className={`flex-1 py-2 rounded flex items-center justify-center gap-2 ${
              uploadType === "bulk"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300"
            }`}
          >
            <FaUpload /> Bulk Upload
          </button>
        </div>

        {uploadType === "single" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Student Name"
              className={inputStyle}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              placeholder="Email ID"
              className={inputStyle}
            />
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Department"
              className={inputStyle}
            />
            <input
              type="text"
              value={academic}
              onChange={(e) => setAcademic(e.target.value)}
              placeholder="Academic Year"
              className={inputStyle}
            />
            <input
              type="tel"
              value={phone}
              maxLength={10}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className={inputStyle}
            />
            <input
              type="text"
              value={registerNo}
              onChange={(e) => setRegisterNo(e.target.value)}
              placeholder="Register Number"
              className={inputStyle}
            />
            <input
              type="text"
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              placeholder="University Name"
              className={inputStyle}
            />
            <button
              className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              onClick={singleUpload}
            >
              Register
            </button>
          </div>
        )}

        {uploadType === "bulk" && (
          <div className="flex flex-col gap-3">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Upload Excel with: SrNo, RegisterNo (B), Name (C), Email (D),
              University (E), AcademicYear (F), Department (H), optional Phone
              (G)
            </p>
            <input
              type="file"
              onChange={bulkFile}
              className={`border border-dashed border-blue-400 p-5 rounded cursor-pointer text-sm transition ${
                isDarkMode
                  ? "bg-slate-800 text-gray-300 hover:bg-slate-700"
                  : "bg-white hover:bg-blue-50 text-gray-700"
              }`}
            />
            <button
              className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
              onClick={submitBulkUsers}
            >
              {sub ? "Submit" : "Upload"}
            </button>
          </div>
        )}
      </div>
    )}

    {/* Student List */}
    <div
      className={`rounded-lg shadow p-5 ${
        isDarkMode ? "bg-slate-800" : "bg-white"
      }`}
    >
      <h2 className="text-lg font-semibold text-center mb-4">Student List</h2>
      <div className="h-full overflow-y-auto">{renderStudents()}</div>
    </div>

    {/* Modal */}
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div
          className={`p-6 rounded-lg shadow-lg w-full max-w-sm text-center ${
            isDarkMode
              ? "bg-slate-800 text-white"
              : "bg-white text-gray-800"
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

export default Teacherthird;
