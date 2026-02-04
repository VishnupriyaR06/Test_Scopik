import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

function AddTeacher() {
  const [search, setSearch] = useState("");
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [uploadType, setUploadType] = useState(null);
  const [univDrop, setUnivDrop] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [department, setDepartment] = useState("");
  const [user_type] = useState("Faculty");

  const [bulkUsers, setBulkUsers] = useState([]);
  const [sub, setSub] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedTeacherEmails, setSelectedTeacherEmails] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIcon, setModalIcon] = useState(null);

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const username = import.meta.env.VITE_USER_NAME;
  const password = import.meta.env.VITE_USER_PASS;

  const token = btoa(`${username}:${password}`);

  const inputStyle =
    "p-2 border rounded outline-none bg-white dark:bg-slate-800 dark:text-white";

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    handleUniversity();
  }, []);

  const handleUniversity = () => {
    axios
      .get(import.meta.env.VITE_VIEW_UNIVERSITY,{
        headers:{
          Authorization:`Basic ${token}`
        }
      })
      .then((res) => {
        setUnivDrop(res.data);
      })
      .catch((err) => {
        console.error("There is an error in Fetching", err);
      });
  };

  useEffect(() => {
    const uniq = Array.from(
      new Set(
        teachers.map((t) => (t.university || "").trim()).filter(Boolean)
      )
    );
    setUniversities(uniq);
  }, [teachers]);

  useEffect(() => {
    if (selectedUniversity) {
      const deps = Array.from(
        new Set(
          teachers
            .filter(
              (t) =>
                (t.university || "").toLowerCase() ===
                selectedUniversity.toLowerCase()
            )
            .map((t) => (t.department || "").trim())
            .filter(Boolean)
        )
      );
      setDepartments(deps);
      setSelectedDepartment(deps[0] || "");
    } else {
      setDepartments([]);
      setSelectedDepartment("");
    }
  }, [selectedUniversity, teachers]);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_TEACHER_LIST_URL,{
        headers:{
          Authorization:`Basic ${token}`
        }
      });
      setTeachers(res.data || []);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  const openModal = (message, icon) => {
    setModalMessage(message);
    setModalIcon(icon);
    setShowModal(true);
  };

  const singleUpload = async () => {
    if (!name || !email || !department) {
      openModal(
        "Please fill name, email and Department.",
        <AlertTriangle size={40} className="text-yellow-500" />
      );
      return;
    }
    try {
      await axios.post(import.meta.env.VITE_REGISTER, {
        name,
        email,
        user_type,
        phone,
        university: universityName,
        department: department,
      });
      openModal(
        "Teacher registered successfully! Check Email for Other Details",
        <CheckCircle size={40} className="text-green-500" />
      );
      fetchTeachers();
      resetSingleForm();
    } catch (err) {
      console.error("Register error:", err);
      openModal(
        "Failed to register teacher.",
        <XCircle size={40} className="text-red-500" />
      );
    }
  };

  const resetSingleForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setUniversityName("");
    setDepartment("");
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
      openModal(
        "No data to upload.",
        <AlertTriangle size={40} className="text-yellow-500" />
      );
      return;
    }
    try {
      await axios.post(import.meta.env.VITE_BULK_UPLOAD, { users: bulkUsers });
      openModal(
        "Bulk registration successful!",
        <CheckCircle size={40} className="text-green-500" />
      );
      fetchTeachers();
      setBulkUsers([]);
      setSub(false);
    } catch (err) {
      console.error("Bulk upload error:", err);
      openModal(
        "Error in bulk upload.",
        <XCircle size={40} className="text-red-500" />
      );
    }
  };

  const handleTeacherCheckbox = (email) => {
    setSelectedTeacherEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleExportCSV = () => {
    const teachersToExport =
      selectedTeacherEmails.length > 0
        ? teachers.filter((t) => selectedTeacherEmails.includes(t.email))
        : teachers;
    if (!teachersToExport.length) {
      openModal(
        "No teachers selected or available to export.",
        <AlertTriangle size={40} className="text-yellow-500" />
      );
      return;
    }
    const data = teachersToExport.map((t) => ({
      Name: t.name,
      Email: t.email,
      Phone: t.phone || t.phone_number || "",
      University: t.university || "",
      Department: t.department || "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teachers");
    XLSX.writeFile(wb, "teachers_export.csv", { bookType: "csv" });
  };

  const handleSelectedDelete = async () => {
    if (!selectedTeacherEmails.length) {
      openModal(
        "No teachers selected to delete.",
        <AlertTriangle size={40} className="text-yellow-500" />
      );
      return;
    }

    if (!confirm(`Delete ${selectedTeacherEmails.length} selected teacher(s)?`))
      return;

    try {
      const res = await axios({
        method: "delete",
        url: import.meta.env.VITE_TEACHER_DELETE,
        data: {
          select_all: false,
          selected_name: selectedTeacherEmails,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      openModal(
        res.data?.message || "Selected teachers deleted.",
        <CheckCircle size={40} className="text-green-500" />
      );

      setTeachers((prev) =>
        prev.filter((t) => !selectedTeacherEmails.includes(t.email))
      );
      setSelectedTeacherEmails([]);
    } catch (err) {
      console.error("Delete selected error:", err?.response?.data || err.message);
      openModal(
        "Failed to delete selected teachers.",
        <XCircle size={40} className="text-red-500" />
      );
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete ALL teachers in this view?"))
      return;
    try {
      const res = await axios.delete(import.meta.VITE_TEACHER_DELETE, {
        data: {
          select_all: true,
          university: activeTab === "university" ? selectedUniversity : undefined,
        },
      });
      openModal(
        res.data?.message || "All teachers deleted for this selection.",
        <CheckCircle size={40} className="text-green-500" />
      );
      fetchTeachers();
      setSelectedTeacherEmails([]);
    } catch (err) {
      console.error("Delete all error:", err?.response?.data || err.message);
      openModal(
        "Failed to delete all teachers.",
        <XCircle size={40} className="text-red-500" />
      );
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "university" && universities.length > 0) {
      setSelectedUniversity(universities[0]);
    } else {
      setSelectedUniversity("");
      setSelectedDepartment("");
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const q = search.trim().toLowerCase();
    const matchQuery =
      !q ||
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.email && t.email.toLowerCase().includes(q));
    if (!matchQuery) return false;

    if (activeTab === "all") return true;

    if (activeTab === "university" && selectedUniversity) {
      const matchUni =
        (t.university || "").toLowerCase() === selectedUniversity.toLowerCase();
      const matchDep =
        !selectedDepartment ||
        (t.department || "").toLowerCase() === selectedDepartment.toLowerCase();
      return matchUni && matchDep;
    }

    if (activeTab === "common")
      return (t.university || "").toLowerCase().includes("scopik");

    return true;
  });

  const renderTeachers = () => {
    if (filteredTeachers.length === 0) {
      return <p className="text-gray-500 text-center mt-10">No teachers found.</p>;
    }
    return (
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={
                filteredTeachers.length > 0 &&
                selectedTeacherEmails.length === filteredTeachers.length
              }
              onChange={(e) => {
                if (e.target.checked)
                  setSelectedTeacherEmails(filteredTeachers.map((s) => s.email));
                else setSelectedTeacherEmails([]);
              }}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <label className="text-sm text-gray-700 dark:text-white">Select All</label>
            {selectedTeacherEmails.length > 0 && (
              <div className="text-sm ml-6 text-gray-700">
                {selectedTeacherEmails.length} selected
              </div>
            )}
          </div>

          {selectedTeacherEmails.length > 0 && (
            <div className="flex gap-4">
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

        {filteredTeachers.map((t, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border-b py-2 px-2 bg-gray-50 rounded hover:bg-gray-100 transition dark:bg-slate-800"
          >
            <input
              type="checkbox"
              checked={selectedTeacherEmails.includes(t.email)}
              onChange={() => handleTeacherCheckbox(t.email)}
              onClick={(e) => e.stopPropagation()}
              className="form-checkbox h-5 w-5 text-blue-600"
            />

            <div
              className="flex flex-col gap-1 cursor-pointer w-full"
              onClick={() => {
                setSelectedTeacher(t);
                setTeacherModalOpen(true);
              }}
            >
              <span className="text-base font-medium text-gray-800 dark:text-white">
                {index + 1}. {t.name}
              </span>
              <span className="text-sm text-gray-600 dark:text-white">{t.email}</span>
              <span className="text-sm text-gray-600 dark:text-white">
                University: {t.university || ""}
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-orange-400">
          FACULTY MANAGEMENT
        </h1>
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => {
              setShowUploadOptions((s) => !s);
              setUploadType(null);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showUploadOptions ? "Hide Add Faculty" : "Add Faculty"}
          </button>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded border w-full sm:max-w-xs md:max-w-sm flex-shrink
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 overflow-hidden dark:bg-slate-700 dark:text-white dark:border-slate-600"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-end gap-3 mb-4">
        <div className="flex gap-2">
          {["ALL", "University", "Common"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab.toLowerCase())}
              className={`px-4 py-2 rounded-full text-sm transition ${
                activeTab === tab.toLowerCase()
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
              className={`flex-1 py-2 rounded ${
                uploadType === "single"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Single Upload
            </button>
            <button
              onClick={() => setUploadType("bulk")}
              className={`flex-1 py-2 rounded ${
                uploadType === "bulk"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Bulk Upload
            </button>
          </div>

          {uploadType === "single" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Teacher Name"
                className={inputStyle}
              />
              <input
                type="email"
                value={email.toLowerCase()}
                onChange={(e) => setEmail(e.target.value)}
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
              <select
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                className={inputStyle}
              >
                <option value="">Select University</option>
                {univDrop.map((uni, idx) => (
                  <option key={idx} value={uni.name}>
                    {uni.name}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className={inputStyle}
                maxLength={10}
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
              <p className="text-sm text-gray-700 dark:text-white">
                Upload Excel with: SrNo, EmpID/B (optional), Name (C), Email
                (D), University (E), Designation (F), Phone (G), Password (H
                optional)
              </p>
              <input
                type="file"
                onChange={bulkFile}
                className="border border-dashed border-blue-400 p-5 rounded cursor-pointer bg-white hover:bg-blue-50 text-sm text-gray-700 transition dark:bg-slate-800 dark:text-white"
              />
              {sub && (
                <button
                  onClick={submitBulkUsers}
                  className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Submit Bulk Users
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "university" && (
        <div className="flex gap-4 mb-4">
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="p-2 border rounded bg-white dark:bg-slate-800 dark:text-white"
          >
            {universities.map((uni, idx) => (
              <option key={idx} value={uni}>
                {uni}
              </option>
            ))}
          </select>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="p-2 border rounded bg-white dark:bg-slate-800 dark:text-white"
          >
            <option value="">All Departments</option>
            {departments.map((dep, idx) => (
              <option key={idx} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>
      )}

      {renderTeachers()}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col items-center gap-3">
            {modalIcon}
            <p className="text-gray-800 dark:text-white">{modalMessage}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setShowModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {teacherModalOpen && selectedTeacher && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col gap-3 w-80">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {selectedTeacher.name}
            </h2>
            <p className="text-gray-700 dark:text-gray-200">
              Email: {selectedTeacher.email}
            </p>
            <p className="text-gray-700 dark:text-gray-200">
              Phone: {selectedTeacher.phone || "N/A"}
            </p>
            <p className="text-gray-700 dark:text-gray-200">
              University: {selectedTeacher.university || "N/A"}
            </p>
            <p className="text-gray-700 dark:text-gray-200">
              Department: {selectedTeacher.department || "N/A"}
            </p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setTeacherModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddTeacher;