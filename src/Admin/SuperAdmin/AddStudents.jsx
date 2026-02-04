import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { FaUserCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function AddStudent() {
  const [search, setSearch] = useState("");
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [student, setStudent] = useState([]);
  const [uploadType, setUploadType] = useState(null);
  const [univDrop, setUnivDrop] = useState([])
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("")
  const [registerNo, setRegisterNo] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [academic, setAcademic] = useState("");
  const [bulkUsers, setBulkUsers] = useState([]);
  const [user_type] = useState("student");
  const [sub, setSub] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedStudentEmails, setSelectedStudentEmails] = useState([]);

  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");

  const [filterYear, setFilterYear] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIcon, setModalIcon] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentModalOpen, setStudentModalOpen] = useState(false);

  const [studentProgress, setStudentProgress] = useState(null);
  const [progressData, setProgressData] = useState({});
  const [filterDepartment, setFilterDepartment] = useState("");
    const username = import.meta.env.VITE_USER_NAME;
  const password = import.meta.env.VITE_USER_PASS;

  const token = btoa(`${username}:${password}`);

  const inputStyle = "p-2 border rounded outline-none bg-white dark:bg-slate-800 dark:text-white";

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    handleUniversity()
  }, [])

  const handleUniversity = () => {
    axios.get(import.meta.env.VITE_VIEW_UNIVERSITY,{
      headers:{Authorization:`Basic ${token}`}
    }).then((res) => {
      setUnivDrop(res.data)
    }).catch((err) => {
      console.error("There is an error in Fetching", err)
    })
  }

  useEffect(() => {
    if (selectedStudent?.email && Array.isArray(selectedStudent.courses)) {
      setStudentProgress(selectedStudent);
      selectedStudent.courses.forEach((course) => {
        fetchChapterProgress(course.course_name, selectedStudent.email);
      });
    }
  }, [selectedStudent]);

  const handleStudentCheckbox = (email) => {
    setSelectedStudentEmails((prevSelected) =>
      prevSelected.includes(email)
        ? prevSelected.filter((e) => e !== email)
        : [...prevSelected, email]
    );
  };

  const fetchChapterProgress = (courseName, email) => {
    axios
      .get(import.meta.env.VITE_STATUS_VIEW, {
        params: { email, course: courseName },
      })
      .then((res) => {
        const completed = res.data.chapters?.length || 0;
        const total = res.data.total || 0;
        setProgressData((prev) => ({
          ...prev,
          [courseName]: { completed, total },
        }));
      })
      .catch((err) => console.error(`Error for ${courseName}`, err));
  };

  const fetchStudents = () => {
    axios
      .get(import.meta.env.VITE_STUDENT_DETAILS,{
        headers:{
          Authorization:`Basic ${token}`
        }
      })
      .then((res) => {
        setStudent(res.data);
      })
      .catch((err) => console.error("Error", err));
  };

  const fetchUniversities = () => {
    axios
      .get(import.meta.env.VITE_STUDENT_UNIV)
      .then((res) => {
        const filtered = res.data.filter(
          (uni) => uni.name.toLowerCase() !== "scopik"
        );
        setUniversities(filtered);
        if (filtered.length > 0) {
          setSelectedUniversity(filtered[0].name);
        }
      })
      .catch((err) => console.error("Error fetching universities:", err));
  };

  const filteredStudents = student.filter((s) => {
    const matchName = s.name?.toLowerCase().includes(search.toLowerCase());

    // Normalize year
    const yearValue = s.academicYear || s.academic_year;
    const matchYear = filterYear ? String(yearValue) === filterYear : true;

    const matchUniversity = selectedUniversity
      ? s.university?.toLowerCase() === selectedUniversity.toLowerCase()
      : true;

    const matchDepartment = filterDepartment
      ? s.department === filterDepartment
      : true;

    if (activeTab === "all") return matchName && matchYear && matchUniversity && matchDepartment;

    if (activeTab === "university" && selectedUniversity)
      return matchName && matchYear && matchUniversity && matchDepartment;

    if (activeTab === "common students")
      return (
        matchName &&
        matchYear &&
        s.university?.toLowerCase().includes("scopik") &&
        matchDepartment
      );

    return false;
  });

  const handleAddStudentClick = () => {
    setShowUploadOptions(!showUploadOptions);
    setUploadType(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedUniversity("");
    if (tab === "university") fetchUniversities();
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
            item.B &&
            item.C &&
            item.D &&
            item.E &&
            item.F &&
            item.G &&
            item.H &&
            typeof item.A === "number"
        )
        .map((item) => ({
          name: item.C,
          email: item.D,
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
      await axios.post(import.meta.env.VITE_BULK_UPLOAD, {
        users: bulkUsers,
      });
      openModal(
        "Bulk registration successful!",
        <CheckCircle className="text-green-500" size={40} />
      );
      fetchStudents();
      setBulkUsers([]);
      setSub(false);
    } catch (error) {
      console.error("Upload error:", error);
      openModal(
        "Error in bulk upload.",
        <XCircle className="text-red-500" size={40} />
      );
    }
  };

  const singleUpload = async () => {
    if (
      !name ||
      !email ||
      !registerNo ||
      !universityName ||
      !academic ||
      !department ||
      !phone
    ) {
      openModal(
        "Please fill all fields.",
        <AlertTriangle className="text-yellow-500" size={40} />
      );
      return;
    }
    try {
      await axios.post(import.meta.env.VITE_REGISTER, {
        name,
        email,
        user_type,
        department: department,
        registerno: registerNo,
        university: universityName,
        academicYear: academic,
        phone,
      });
      openModal(
        "Student registered successfully!",
        <CheckCircle className="text-green-500" size={40} />
      );
      fetchStudents();
      resetSingleForm();
    } catch (err) {
      console.error("Error", err);
      openModal(
        "Failed to register student.",
        <XCircle className="text-red-500" size={40} />
      );
    }
  };

  const openModal = (message, icon) => {
    setModalMessage(message);
    setModalIcon(icon);
    setShowModal(true);
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

  const handleExportCSV = () => {
    const studentsToExport =
      selectedStudentEmails.length > 0
        ? filteredStudents.filter((stu) =>
          selectedStudentEmails.includes(stu.email)
        )
        : filteredStudents;

    if (!studentsToExport.length) {
      openModal(
        "No students selected or available to export.",
        <AlertTriangle className="text-yellow-500" size={40} />
      );
      return;
    }

    const dataToExport = studentsToExport.map((stu) => ({
      Name: stu.name,
      Email: stu.email,
      Phone: stu.phone_number,
      RegisterNo: stu.registerno,
      University: stu.university,
      AcademicYear: stu.academicYear || stu.academic_year,
      Department: stu.department,
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
        import.meta.env.VITE_STUDENT_DELETE,
        {
          data: {
            select_all: false,
            selected_name: selectedStudentEmails,
          },
        }
      );

      openModal(
        response.data.message || "Selected students deleted successfully.",
        <CheckCircle className="text-green-500" size={40} />
      );

      const updatedStudentList = student.filter(
        (stu) => !selectedStudentEmails.includes(stu.email)
      );
      setStudent(updatedStudentList);
      setSelectedStudentEmails([]);
    } catch (err) {
      console.error(
        "Error deleting students:",
        err?.response?.data || err.message
      );
      openModal(
        "Failed to delete selected students.",
        <XCircle className="text-red-500" size={40} />
      );
    }
  };

  const renderStudents = () => {
    if (filteredStudents.length === 0) {
      return (
        <p className="text-gray-500 text-center mt-10">No students found.</p>
      );
    }
    return (
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="flex items-center justify-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={
                filteredStudents.length > 0 &&
                selectedStudentEmails.length === filteredStudents.length
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedStudentEmails(
                    filteredStudents.map((s) => s.email)
                  );
                } else {
                  setSelectedStudentEmails([]);
                }
              }}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <label className="text-sm text-gray-700 dark:text-white">Select All</label>
            {selectedStudentEmails.length > 0 && (
              <div className="text-sm ml-6 text-gray-700">
                {selectedStudentEmails.length} student(s) selected
              </div>
            )}
          </div>

          {selectedStudentEmails.length > 0 && (
            <div className="flex gap-5">
              <button
                onClick={handleExportCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
              >
                Export CSV
              </button>
              <button
                onClick={handleSelectedDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>

        {filteredStudents.map((stu, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border-b py-2 px-2 bg-gray-50 rounded hover:bg-gray-100 transition dark:bg-slate-800"
          >
            <input
              type="checkbox"
              checked={selectedStudentEmails.includes(stu.email)}
              onChange={() => handleStudentCheckbox(stu.email)}
              onClick={(e) => e.stopPropagation()}
              className="form-checkbox h-5 w-5 text-blue-600"
            />

            <div
              className="flex flex-col gap-1 cursor-pointer w-full "
              onClick={() => {
                setSelectedStudent(stu);
                setStudentModalOpen(true);
              }}
            >
              <span className="text-base font-medium text-gray-800 dark:text-white">
                {index + 1}. {stu.name}
              </span>
              <span className="text-sm text-gray-600 dark:text-white">{stu.email}</span>
              <span className="text-sm text-gray-600 dark:text-white">
                Academic Year:{" "}
                {stu.academicYear ? `${stu.academicYear} Year` : "Not Assigned"}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full rounded-xl min-h-screen bg-gray-50 px-4 py-8 dark:bg-slate-900">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-orange-400">STUDENT DETAILS</h1>
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleAddStudentClick}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showUploadOptions ? "Hide Add Student" : "Add Student"}
          </button>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded border w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-end gap-3 mb-4">
        <div className="flex gap-2">
          {["Overall Students", "University", "Common Students"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab === "Overall Students" ? "all" : tab.toLowerCase())}
              className={`px-4 py-2 rounded-full text-sm transition ${activeTab === (tab === "Overall Students" ? "all" : tab.toLowerCase())
                  ? "bg-blue-600 text-white"
                  : "bg-white border text-gray-700 hover:bg-blue-50"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {showUploadOptions && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 dark:bg-slate-800">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setUploadType("single")}
              className={`flex-1 py-2 rounded ${uploadType === "single"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700"
                }`}
            >
              Single Upload
            </button>
            <button
              onClick={() => setUploadType("bulk")}
              className={`flex-1 py-2 rounded ${uploadType === "bulk"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700"
                }`}
            >
              Bulk Upload
            </button>
          </div>

          {uploadType === "single" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Student Name"
                className={inputStyle}
              />
              <input
                type="email"
                value={email.toLowerCase()}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email ID"
                className={inputStyle}
              />
              <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Department" className={inputStyle} />
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

              {/* ? Fixed university dropdown */}
              <select
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                className={inputStyle}
              >
                <option value="">Select University</option>
                {univDrop.map((uni, idx) => (<>
                  <option key={idx} value={uni.name}>
                    {uni.name}
                  </option>
                </>))}
              </select>

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
              <p className="text-sm text-gray-700 dark:text-white  dark:bg-slate-800 dark:text-white">
                Upload Excel with: SrNo, RegisterNo (B), Name (C), Email (D),
                University (E), AcademicYear (F), Department (H), optional Phone
                (G)
              </p>
              <input
                type="file"
                onChange={bulkFile}
                className="border border-dashed border-blue-400 p-5 rounded cursor-pointer bg-white hover:bg-blue-50 text-sm text-gray-700 transition dark:bg-slate-800"
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

      {activeTab === "university" && (
        <div className="mb-4 flex justify-between items-center">
          {/* University */}
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="p-2 rounded border text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-[500px] dark:bg-slate-800 dark:text-white"
          >
            {universities.map((uni, index) => (
              <option key={index} value={uni.name}>
                {uni.name}
              </option>
            ))}
          </select>

          {/* Department */}
          <div className="mb-4 flex justify-between items-center gap-3">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="p-2 rounded border text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-[200px] dark:bg-slate-800 dark:text-white"
            >
              <option value="">Filter by Department</option>
              {[...new Set(student.map((s) => s.department))]
                .filter((dep) => dep)
                .map((dep, idx) => (
                  <option key={idx} value={dep}>
                    {dep}
                  </option>
                ))}
            </select>

            {/* Year */}
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="p-2 rounded border text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-[200px] dark:bg-slate-800 dark:text-white"
            >
              <option value="">Filter by Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
            </select>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 dark:bg-slate-800">
        <h2 className="text-lg font-semibold text-center text-gray-800 mb-4 dark:text-white">
          {activeTab === "all"
            ? "Overall Students"
            : activeTab === "university" && selectedUniversity
              ? `${selectedUniversity} Students`
              : activeTab === "common students"
                ? "Common Students"
                : activeTab}
        </h2>

        <div className="h-full overflow-y-auto">{renderStudents()}</div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            {modalIcon}
            <p className="mt-3 mb-4 text-gray-800 text-lg">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {studentModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-6 w-full max-w-6xl rounded-lg shadow-lg max-h-[90vh] overflow-y-auto dark:bg-slate-800">
            <button
              onClick={() => setStudentModalOpen(false)}
              className="absolute top-4 right-6 text-gray-500 hover:text-red-600 text-4xl"
              title="Close"
            >
              &times;
            </button>
            <div className="flex items-center gap-4 mb-6">
              {selectedStudent.profile_image ? (
                <img
                  src={selectedStudent.profile_image}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border"
                />
              ) : (
                <FaUserCircle className="w-20 h-20 text-gray-400" />
              )}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {selectedStudent?.name || "Null"}
                </h2>
                <p className="text-sm text-gray-600  dark:text-white">
                  {selectedStudent.email || "Null"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-black font-semibold  dark:text-white">Phone</label>
                <p className="text-gray-800  dark:text-white">
                  {selectedStudent.phone_number || "Null"}
                </p>
              </div>
              <div>
                <label className="text-black font-semibold  dark:text-white">Register No</label>
                <p className="text-gray-800  dark:text-white">
                  {selectedStudent.registerno || "Null"}
                </p>
              </div>
              <div>
                <label className="text-black font-semibold  dark:text-white">University</label>
                <p className="text-gray-800  dark:text-white">
                  {selectedStudent.university || "Null"}
                </p>
              </div>
              <div>
                <label className="text-black font-semibold  dark:text-white">Department</label>
                <p className="text-gray-800  dark:text-white">
                  {selectedStudent.department || "Null"}
                </p>
              </div>
              <div>
                <label className="text-black font-semibold  dark:text-white">
                  Academic Year
                </label>
                <p className="text-gray-800  dark:text-white">
                  {selectedStudent.academic_year || "Null"}
                </p>
              </div>
            </div>

            <hr className="my-4" />
            <h3 className="text-xl font-semibold text-black mb-3  dark:text-white">
              Enrolled Courses
            </h3>
            {Array.isArray(selectedStudent.courses) &&
              selectedStudent.courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {selectedStudent.courses.map((course, idx) => (
                  <div
                    key={idx}
                    className="border rounded p-4 bg-gray-50 flex items-start gap-4 shadow-sm"
                  >
                    <img
                      src={course.course_image}
                      alt={course.course_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {course.course_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Completed: {course.complated ? "? Yes" : "? No"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No courses enrolled.</p>
            )}

            <hr className="my-4" />
            <h3 className="text-xl font-semibold text-black mb-3  dark:text-white">Payments</h3>
            {Array.isArray(selectedStudent.payments) &&
              selectedStudent.payments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedStudent.payments.map((pay, index) => (
                  <div
                    key={index}
                    className="border rounded p-4 bg-white shadow-sm flex flex-col gap-2 dark:bg-slate-800"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800 font-medium text-lg  dark:text-blue-300">
                        {pay.course_name}
                      </span>
                      {pay.status ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded  dark:text-white">
                          <FaCheckCircle className="text-green-600" />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded  dark:text-white">
                          <FaTimesCircle className="text-red-600" />
                          Failed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600  dark:text-white">
                      Amount: {pay.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600  dark:text-white">
                      Date: {new Date(pay.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600  dark:text-white">
                      Phone: {pay.phone_number}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500  dark:text-white">No payment records found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AddStudent;

