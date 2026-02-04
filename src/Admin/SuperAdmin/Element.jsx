import { useEffect, useState } from "react";
import axios from "axios";
import useTheme from "/src/Hooks/ThemeHook";

import AddCourse from "./Course_Add/Addcourse";
import AddChapter from "./Course_Add/AddChapter";
import Documents from "./Course_Add/Documents";
import AddQuiz from "./Course_Add/AddQuiz";
import AddUniversity from "./AddUniversity";
import AddTeacher from "./AddTeacher";
import AddStudent from "./AddStudents";
import CertificateTemplate from "./CertificateTemplate";
import Addblog from "./AddBlog";
import SemesterList from "./SemesterList";
import bgImage from "/src/assets/SuperAdmin/superadmin.png";

function Element() {
  const [course, setCourse] = useState();
  const [students, setStudents] = useState();
  const [college, setCollege] = useState();

  const [showModal, setShowModal] = useState(false);
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showSemesterModal, setShowSemesterModal] = useState(false);

  const [step, setStep] = useState(1);
  const [currentStepCompleted, setCurrentStepCompleted] = useState(false);
  const steps = ["Course", "Chapter", "Resource", "Quiz"];
  const isDarkMode = useTheme();

  useEffect(() => {
    axios.get(import.meta.env.VITE_COUNT).then((json) => {
      setCollege(json.data.total_university);
      setStudents(json.data.total_student);
      setCourse(json.data.total_course);
    });
  }, []);

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
      setCurrentStepCompleted(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setCurrentStepCompleted(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setCurrentStepCompleted(false);
  };
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <AddCourse
            onSuccess={() => setStep(2)}
          />
        );
      case 2:
        return (
          <AddChapter
            onSuccess={() => setStep(3)}
          />
        );
      case 3:
        return (
          <Documents
            onSuccess={() => setStep(4)}
          />
        );
      case 4:
        return (
          <AddQuiz
            onSuccess={closeModal}
            goToChapterStep={() => setStep(2)}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div
  className={`rounded-2xl min-h-[550px] lg:h-[550px] p-6 shadow-lg transition-all duration-300 ${
    isDarkMode
      ? "bg-gradient-to-br from-sky-800 to-sky-800 text-white"
      : "bg-gradient-to-br from-[#084E90] to-[#23A4DC] text-gray-800"
  }`}
>
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Welcome Box */}
          <div
            className="rounded-xl shadow-md p-8 flex flex-col justify-center bg-cover bg-center h-[200px]"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <h1 className="text-2xl font-semibold text-white drop-shadow dark:text-[#FB923C] ">Welcome</h1>
            <h2 className="text-4xl font-bold text-white drop-shadow mt-2 dark:text-[#FB923C]">Scopik Admin</h2>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 flex-1">
            <ActionButton text="+ Create Course"  onClick={() => setShowModal(true)} />

            <div className="grid grid-cols-2 gap-4">
              <ActionButton text="+ Add Student"  onClick={() => setShowStudentModal(true)} />
              <ActionButton text="+ Add Faculty" onClick={() => setShowFacultyModal(true)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ActionButton text="+ Certificate Template"  onClick={() => setShowCertificateModal(true)} />
              <ActionButton text="+ Add University"  onClick={() => setShowUniversityModal(true)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ActionButton text="+ Add Blog"  onClick={() => setShowBlogModal(true)} />
              <ActionButton text="+ Semester List"  onClick={() => setShowSemesterModal(true)} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 color='#FB9237'">
          <StatCard count={course} label="Courses" />
          <StatCard count={students} label="Students" />
          <StatCard count={college} label="Colleges" />
        </div>
      </div>

      {/* Create Course Modal */}
      {showModal && (
        <Modal onClose={closeModal} width="max-w-4xl" height="h-[90vh]">
          <div className="mb-6">
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#084D90] h-full transition-all duration-500"
                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
            <div className="mt-2 text-center text-gray-600 dark:text-gray-300 font-medium">
              Step {step} of {steps.length}: {steps[step - 1]}
            </div>
          </div>
          <div className="flex-1">{renderStepContent()}</div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`px-5 py-2 rounded-md font-medium transition ${
                step === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Back
            </button>
            {step < steps.length && (
              <button
                onClick={handleNext}
                disabled={!currentStepCompleted}
                className={`px-5 py-2 rounded-md font-medium transition ${
                  currentStepCompleted
                    ? "bg-[#084D90] text-white hover:bg-blue-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* Other Modals */}
      {showUniversityModal && (
        <Modal onClose={() => setShowUniversityModal(false)} width="max-w-7xl" height="h-[90vh]">
          <div className="p-6 flex flex-col h-full">
            <h2 className="text-2xl font-bold text-[#084D90] dark:text-white mb-4">Universities</h2>
            <div className="flex-1 overflow-auto"><AddUniversity /></div>
          </div>
        </Modal>
      )}
      {showFacultyModal && (
        <Modal onClose={() => setShowFacultyModal(false)} width="max-w-5xl" height="h-[90vh]">
          <div className="p-6 flex flex-col h-full">
            <h2 className="text-2xl font-bold text-[#084D90] dark:text-white mb-4">Add Faculty</h2>
            <div className="flex-1 overflow-auto"><AddTeacher /></div>
          </div>
        </Modal>
      )}
      {showStudentModal && (
        <Modal onClose={() => setShowStudentModal(false)} width="max-w-4xl" height="h-[90vh]">
          <div className="p-6 flex flex-col h-full">
            <h2 className="text-2xl font-bold text-[#084D90] dark:text-white mb-4">Add Student</h2>
            <div className="flex-1 overflow-auto"><AddStudent /></div>
          </div>
        </Modal>
      )}
      {showCertificateModal && (
        <Modal onClose={() => setShowCertificateModal(false)} width="max-w-2xl" height="h-[70vh]">
          <CertificateTemplate />
        </Modal>
      )}
      {showBlogModal && (
        <Modal onClose={() => setShowBlogModal(false)} width="max-w-2xl" height="h-[70vh]">
          <Addblog />
        </Modal>
      )}
      {showSemesterModal && (
        <Modal onClose={() => setShowSemesterModal(false)} width="max-w-2xl" height="h-[70vh]">
          <SemesterList />
        </Modal>
      )}
    </div>
  );
}

function Modal({ onClose, children, width = "max-w-2xl", height = "h-[80vh]" }) {
  const isDarkMode = useTheme();
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <div className={`w-full ${width} ${height} rounded-xl shadow-xl relative flex flex-col
        ${isDarkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}>
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold z-10">
          &times;
        </button>
        <div className="p-6 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function ActionButton({ text, color, onClick }) {
  const isDarkMode=useTheme()
  return (
    <div>
    <button
      onClick={onClick}
      className={`w-full px-5 py-4 rounded-md hover:opacity-90 transition font-medium shadow  ${isDarkMode?"bg-slate-800 text-orange-400":"bg-[#00b1ff] text-white"}`}
      style={{ backgroundColor: color }}
    >
      {text}
    </button>
  </div>);
}

function StatCard({ count, label }) {
  const isDarkMode = useTheme();
  return (
    <div
      className={`rounded-xl shadow-md p-6 flex flex-col justify-center items-center h-[150px] ${
        isDarkMode ? "bg-slate-800 text-orange-400" : "bg-white text-[#084D90]"
      }`}
    >
      <p className="text-4xl font-bold">{count}</p>
      <h3 className="text-xl font-medium">{label}</h3>
    </div>
  );
}

export default Element;
