import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CourseContext } from "/src/App";
import Quizzes from "/src/Components/CourseComponents/Quizzes.jsx";
import Header from "/src/Components/ReusableComponents/Header.jsx";
import useTheme from "/src/Hooks/ThemeHook.js";
import {
  ChevronDown,
  Lock,
  ChevronLeft,
  ChevronRight,
  BookOpenText,
  Activity,
  FileText,
  HelpCircle,
  Unlock,
} from "lucide-react";

export default function CourseContent() {
  const isDarkMode = useTheme();
  const { id } = useParams();
  const { Course: CourseList } = useContext(CourseContext);
  const Uemail = localStorage.getItem("userEmail");

  const Content = CourseList.find((course) => course.id === Number(id));
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [certificateName, setCertificateName] = useState("");
  const [loading, setLoading] = useState(true);
  const [completedChapters, setCompletedChapters] = useState([]);
  const [unlockedChapters, setUnlockedChapters] = useState([0]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [scrollCompleted, setScrollCompleted] = useState(false);
  const [mode, setMode] = useState("ppt");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [quizChapterId, setQuizChapterId] = useState(null);
  const [currentMaterialIndex, setCurrentMaterialIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!Uemail || !CourseList?.length) return;

    setLoading(true);
    const selectedCourse = CourseList.find(
      (course) => course.id === Number(id)
    );

    if (selectedCourse) {
      setCertificateName(selectedCourse.name);

      // merge PDFs and Videos into one materials array
      const formattedChapters = selectedCourse.chapters.map(
        (chapter, index) => {
          const pdfs =
            chapter.materials?.map((m) => ({
              type: "pdf",
              url: m.material.replace(/^http:/, "https:"),
              name: m.material_name,
            })) || [];

          const vids =
            chapter.videos?.map((v) => ({
              type: "video",
              url: v.video.replace(/^http:/, "https:"),
              name: v.video_name,
            })) || [];

          return {
            title: chapter.title,
            id: chapter.id,
            index,
            materials: [...pdfs, ...vids],
          };
        }
      );

      setCourseData(formattedChapters);

      const firstUnlockedChapter = formattedChapters[0];
      if (firstUnlockedChapter) {
        setSelectedChapterId(firstUnlockedChapter.id);
        const firstMaterial = firstUnlockedChapter.materials?.[0];
        if (firstMaterial) {
          setSelectedMaterial(firstMaterial);
          setMode(firstMaterial.type);
          setCurrentMaterialIndex(0);
        }
      }

      async function fetchProgress() {
        try {
          const res = await axios.get(import.meta.env.VITE_STATUS_VIEW, {
            params: {
              email: Uemail,
              course: selectedCourse.name,
            },
          });

          const chapters = res.data?.chapters || [];

          const completed = chapters
            .filter((ch) => ch.status === true)
            .map((ch) => ch.chapter_title);

          const unlocked = completed.map((_, index) => index);
          if (completed.length < selectedCourse.chapters.length) {
            unlocked.push(completed.length);
          }

          setCompletedChapters(completed);
          setUnlockedChapters(unlocked.length ? unlocked : [0]);
        } catch (err) {
          console.error("Error fetching progress:", err);
          setUnlockedChapters([0]);
        } finally {
          setLoading(false);
        }
      }

      fetchProgress();
    } else {
      setLoading(false);
    }
  }, [id, CourseList, Uemail]);

  useEffect(() => {
    setScrollCompleted(false);
  }, [selectedMaterial]);

  const unlockNextChapter = async (index) => {
    const chapter = courseData[index];
    if (!chapter || completedChapters.includes(chapter.title)) {
      return;
    }

    const newCompleted = [...completedChapters, chapter.title];
    setCompletedChapters(newCompleted);

    const newUnlocked = [...unlockedChapters];
    if (!newUnlocked.includes(index + 1)) newUnlocked.push(index + 1);
    setUnlockedChapters(newUnlocked);

    const payload = {
      email: Uemail,
      course: certificateName,
      chapter: newCompleted.map((title) => ({
        chapter_title: title,
        status: true,
      })),
    };

    try {
      await axios.post(import.meta.env.VITE_STATUS_CREATE, payload);
    } catch (err) {
      console.error(
        "Error updating progress:",
        err?.response?.data || err.message
      );
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 5;

    const chapter = courseData.find((ch) => ch.id === selectedChapterId);
    const isLastMaterial =
      chapter?.materials?.[chapter.materials.length - 1]?.url ===
      selectedMaterial?.url;

    if (atBottom && selectedChapterId !== null && isLastMaterial) {
      setScrollCompleted(true);
      setShowQuiz(true);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-xl text-orange-500">Loading...</div>
    );
  }

  const currentQuiz = Content?.quizzes?.find(
    (q) => q.chapter === selectedChapterId
  );

  const totalChapters = courseData.length;
  const completedCount = completedChapters.length;
  const progressPercent = Math.round((completedCount / totalChapters) * 100);

  // helper to render pdf/video
  const renderMaterial = (mat) => {
    if (!mat) return null;

    if (mat.type === "pdf") {
      return (
        <iframe
          key={mat.url}
          src={`https://docs.google.com/gview?url=${encodeURIComponent(
            mat.url
          )}&embedded=true`}
          style={{ width: "100%", height: "1500px", marginTop:"50px" }}
          frameBorder="0"
          title="PDF Viewer"
        />
      );
    } else if (mat.type === "video") {
      return (
        <video
          key={mat.url}
          src={mat.url}
          controls
          style={{ width: "100%", height: "auto",marginTop:"65px"}}
          onTimeUpdate={(e) => {
            const video = e.target;
            const progress = (video.currentTime / video.duration) * 100;

            const chapter = courseData.find((ch) => ch.id === selectedChapterId);
            const isLastMaterial =
              chapter?.materials?.[chapter.materials.length - 1]?.url ===
              selectedMaterial?.url;

            if (progress >= 90 && selectedChapterId !== null && isLastMaterial) {
              setScrollCompleted(true);
              setShowQuiz(true);
            }
          }}
        />
      );
    }
    return <div>Unsupported file type</div>;
  };

  return (
    <>
      <Header />
      <div className="flex bg-white text-white min-h-screen">
        {/* Sidebar */}
        <aside
          className={`${isSidebarOpen ? "w-96" : "w-20"} ${
            isDarkMode ? "bg-black" : "bg-white"
          } border-r border-orange-500 p-4 h-screen fixed top-10 left-0 overflow-y-auto transition-all duration-300 flex flex-col justify-between`}
        >
          <div>
            <div className="flex justify-between items-center mb-4 pt-5">
              {isSidebarOpen ? (
                <h2 className="text-xl font-bold text-orange-500 flex items-center">
                  <BookOpenText className="inline-block mr-2" size={24} />
                  Course Content
                </h2>
              ) : (
                <BookOpenText className="text-orange-500" size={24} />
              )}
              <button
                className="text-orange-400 hover:text-orange-600"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
              >
                {isSidebarOpen ? (
                  <ChevronLeft size={30} />
                ) : (
                  <ChevronRight size={30} />
                )}
              </button>
            </div>

            {courseData.map((chapter, index) => {
              const isUnlocked = unlockedChapters.includes(index);
              const isOpen = selectedChapterId === chapter.id;

              return (
                <div
                  key={chapter.id}
                  className={`mb-2 border shadow-md rounded-lg ${
                    !isUnlocked
                      ? "opacity-50 pointer-events-none"
                      : "hover:border-orange-500 transition-all"
                  }`}
                >
                  <div
                    className={`bg-transparent px-4 py-2 font-medium cursor-pointer rounded-t-lg hover:text-orange-400 ${
                      isDarkMode ? "text-white" : "text-black"
                    } flex items-center justify-between`}
                    onClick={() => {
                      if (isUnlocked) {
                        setSelectedChapterId(isOpen ? null : chapter.id);
                        setShowQuiz(false);
                        setScrollCompleted(false);
                        setSelectedMaterial(null);

                        if (!isOpen && chapter.materials?.[0]) {
                          setSelectedMaterial(chapter.materials[0]);
                          setMode(chapter.materials[0].type);
                          setCurrentMaterialIndex(0);
                        }
                      }
                    }}
                  >
                    {isSidebarOpen ? (
                      <span className={`flex items-center `}>
                        {isUnlocked ? (
                          <Unlock className="text-orange-500 mr-2" />
                        ) : (
                          <Lock className="text-gray-400  mr-2" />
                        )}
                        {chapter.title}
                      </span>
                    ) : (
                      <>
                        {isUnlocked ? (
                          <Unlock className=" text-orange-500" />
                        ) : (
                          <Lock className=" text-gray-400" />
                        )}
                      </>
                    )}

                    {isUnlocked && isSidebarOpen && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    {isSidebarOpen && (
                      <div className="px-4 pb-2 text-sm">
                        {chapter.materials?.map((mat, i) => (
                          <div
                            key={i}
                            className={`cursor-pointer mb-1 px-3 py-1 rounded-r transition-all duration-200 flex items-center ${
                              selectedMaterial?.url === mat.url
                                ? "bg-orange-500 text-white border-l-4 border-orange-700"
                                : "text-black hover:text-orange-400"
                            } ${isDarkMode ? "text-white" : "text-black"}`}
                            onClick={() => {
                              setSelectedMaterial(mat);
                              setMode(mat.type);
                              setShowQuiz(false);
                              setScrollCompleted(false);
                              setCurrentMaterialIndex(i);
                            }}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            {mat.name}
                          </div>
                        ))}

                        <div
                          className={`cursor-pointer flex items-center px-3 py-1 rounded-r transition-all duration-200 ${
                            scrollCompleted
                              ? "text-orange-500 hover:underline"
                              : "text-gray-500"
                          }`}
                          onClick={() => {
                            if (scrollCompleted) {
                              setMode("quiz");
                              setQuizChapterId(selectedChapterId);
                            } else {
                              alert(
                                "Please scroll/watch fully to unlock the quiz."
                              );
                            }
                          }}
                        >
                          <HelpCircle className="w-4 h-4 mr-2" />
                          Take Quiz
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mb-[90px]">
            {isSidebarOpen ? (
              <>
                <div className="text-sm text-orange-400 mb-1 flex items-center">
                  <Activity className="inline-block mr-2" size={16} /> Progress
                </div>
                <div className="relative h-4 bg-zinc-700 rounded overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-orange-500 transition-all duration-700 ease-in-out"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {progressPercent}% Completed
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-4">
                <Activity className="text-orange-400" size={20} />
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main
          className={`flex flex-col h-screen transition-all duration-300 ease-in-out overflow-hidden ${
            isDarkMode ? "bg-black" : "bg-white"
          } ${
            isSidebarOpen
              ? "ml-96 w-[calc(100%-24rem)]"
              : "ml-20 w-[calc(100%-5rem)]"
          }`}
        >
          {(mode === "pdf" || mode === "video") && (
            <>
              <div
                className={`flex-1 w-full overflow-y-auto rounded shadow-lg border border-zinc-700 transition-opacity duration-500 ${
                  isDarkMode ? "bg-black" : "bg-white"
                } `}
                onScroll={handleScroll}
              >
                {selectedMaterial ? (
                  renderMaterial(selectedMaterial)
                ) : (
                  <div
                    className={`text-center ${
                      isDarkMode ? "text-white" : "text-black"
                    } p-6`}
                  >
                    Select a material to view it.
                  </div>
                )}
              </div>

              {scrollCompleted && (
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-orange-500 text-white px-10 py-2 mr-5 mb-5 rounded hover:bg-orange-600"
                    onClick={() => {
                      const chapter = courseData.find(
                        (ch) => ch.id === selectedChapterId
                      );
                      const nextIndex = currentMaterialIndex + 1;

                      if (chapter && nextIndex < chapter.materials.length) {
                        const nextMaterial = chapter.materials[nextIndex];
                        setSelectedMaterial(nextMaterial);
                        setMode(nextMaterial.type);
                        setCurrentMaterialIndex(nextIndex);
                        setScrollCompleted(false);
                        setShowQuiz(false);
                      } else {
                        setMode("quiz");
                        setQuizChapterId(selectedChapterId);
                      }
                    }}
                  >
                    Show Next
                  </button>
                </div>
              )}
            </>
          )}

          {mode === "quiz" && (
            <div className="mt-20 text-black dark:text-white p-4 rounded shadow border border-zinc-700">
              <Quizzes
                chapterId={quizChapterId}
                quizData={currentQuiz ? [currentQuiz] : []}
                onNextChapter={(completedChapterId) => {
                  const idx = courseData.findIndex(
                    (ch) => ch.id === completedChapterId
                  );
                  unlockNextChapter(idx);

                  const nextChapterIndex = idx + 1;
                  if (nextChapterIndex < Content.chapters.length) {
                    const nextChapter = courseData[nextChapterIndex];
                    setSelectedChapterId(nextChapter.id);
                    setQuizChapterId(nextChapter.id);

                    if (nextChapter.materials?.[0]) {
                      setSelectedMaterial(nextChapter.materials[0]);
                      setCurrentMaterialIndex(0);
                      setMode(nextChapter.materials[0].type);
                    }

                    setShowQuiz(false);
                    setScrollCompleted(false);
                  }
                }}
                userEmail={Uemail}
                courseName={certificateName}
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
