"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  AdminLessonExerciseItem,
  lessonExerciseService,
} from "@/services/lesson-exercise-service";

const COURSE_API_URL =
  "https://shiko-course-api-dana-awdagkgff6gfgtbp.swedencentral-01.azurewebsites.net/api";

type AdminCourse = {
  id: string;
  title: string;
  imageUrl: string;
  lessonCount: number;
  duration: string;
};

const fallbackCourses: AdminCourse[] = [
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    title: "Digital Marketing",
    imageUrl: "",
    lessonCount: 0,
    duration: "",
  },
];

function sortLessonsByOrder(lessons: AdminLessonExerciseItem[]) {
  return [...lessons].sort((a, b) => a.orderIndex - b.orderIndex);
}

export default function AdminLessonsPage() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [lessons, setLessons] = useState<AdminLessonExerciseItem[]>([]);

  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [title, setTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [orderIndex, setOrderIndex] = useState("");

  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDurationMinutes, setEditDurationMinutes] = useState("");
  const [editOrderIndex, setEditOrderIndex] = useState("");

  const selectedCourse = courses.find(
    (course) => course.id === selectedCourseId
  );

  useEffect(() => {
    async function loadCourses() {
      try {
        setIsLoadingCourses(true);
        setErrorMessage("");

        const res = await fetch(`${COURSE_API_URL}/courses`);

        if (!res.ok) {
          throw new Error("Failed to fetch courses.");
        }

        const data: AdminCourse[] = await res.json();

        setCourses(data);

        if (data.length > 0) {
          setSelectedCourseId(data[0].id);
        }
      } catch {
        setCourses(fallbackCourses);
        setSelectedCourseId(fallbackCourses[0].id);
        setErrorMessage(
          "Could not load courses from Course Provider. Showing fallback courses for now."
        );
      } finally {
        setIsLoadingCourses(false);
      }
    }

    loadCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      return;
    }

    async function loadLessons() {
      try {
        setIsLoadingLessons(true);
        setErrorMessage("");
        setSuccessMessage("");
        cancelEditingLesson();

        const data = await lessonExerciseService.getAdminLessonExercises(
          selectedCourseId
        );

        setLessons(sortLessonsByOrder(data));
      } catch {
        setErrorMessage("Could not load lesson exercises.");
      } finally {
        setIsLoadingLessons(false);
      }
    }

    loadLessons();
  }, [selectedCourseId]);

  async function handleCreateLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedCourseId) {
      setErrorMessage("Select a course before creating a lesson.");
      return;
    }

    const parsedDuration = Number(durationMinutes);
    const parsedOrderIndex = Number(orderIndex);

    if (!title.trim() || parsedDuration <= 0 || parsedOrderIndex <= 0) {
      setErrorMessage("Title, duration and order are required.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      await lessonExerciseService.createLessonExercise(
        selectedCourseId,
        {
          title: title.trim(),
          durationMinutes: parsedDuration,
          orderIndex: parsedOrderIndex,
        }
      );

      const updatedLessons = await lessonExerciseService.getAdminLessonExercises(
        selectedCourseId
      );

      setLessons(sortLessonsByOrder(updatedLessons));

      setTitle("");
      setDurationMinutes("");
      setOrderIndex("");
      setSuccessMessage("Lesson exercise was created.");
    } catch {
      setErrorMessage("Could not create lesson exercise.");
    } finally {
      setIsSaving(false);
    }
  }

  function startEditingLesson(lesson: AdminLessonExerciseItem) {
    setEditingLessonId(lesson.id);
    setEditTitle(lesson.title);
    setEditDurationMinutes(lesson.durationMinutes.toString());
    setEditOrderIndex(lesson.orderIndex.toString());
    setErrorMessage("");
    setSuccessMessage("");
  }

  function cancelEditingLesson() {
    setEditingLessonId(null);
    setEditTitle("");
    setEditDurationMinutes("");
    setEditOrderIndex("");
  }

  async function handleUpdateLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedCourseId || !editingLessonId) {
      setErrorMessage("Select a lesson before updating.");
      return;
    }

    const parsedDuration = Number(editDurationMinutes);
    const parsedOrderIndex = Number(editOrderIndex);

    if (!editTitle.trim() || parsedDuration <= 0 || parsedOrderIndex <= 0) {
      setErrorMessage("Title, duration and order are required.");
      return;
    }

    try {
      setIsUpdating(true);
      setErrorMessage("");
      setSuccessMessage("");

      await lessonExerciseService.updateLessonExercise(
        selectedCourseId,
        editingLessonId,
        {
          title: editTitle.trim(),
          durationMinutes: parsedDuration,
          orderIndex: parsedOrderIndex,
        }
      );

      const updatedLessons = await lessonExerciseService.getAdminLessonExercises(
        selectedCourseId
      );

      setLessons(sortLessonsByOrder(updatedLessons));
      cancelEditingLesson();
      setSuccessMessage("Lesson exercise was updated.");
    } catch {
      setErrorMessage("Could not update lesson exercise.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDeleteLesson(lesson: AdminLessonExerciseItem) {
  if (!selectedCourseId) {
    setErrorMessage("Select a course before deleting a lesson.");
    return;
  }

  const shouldDelete = window.confirm(
    `Delete lesson "${lesson.title}"?`
  );

  if (!shouldDelete) {
    return;
  }

  try {
    setDeletingLessonId(lesson.id);
    setErrorMessage("");
    setSuccessMessage("");

    await lessonExerciseService.deleteLessonExercise(
      selectedCourseId,
      lesson.id
    );

    const updatedLessons = await lessonExerciseService.getAdminLessonExercises(
      selectedCourseId
    );

    setLessons(sortLessonsByOrder(updatedLessons));
    setSuccessMessage("Lesson exercise was deleted.");
  } catch {
    setErrorMessage("Could not delete lesson exercise.");
  } finally {
    setDeletingLessonId(null);
  }
}

  return (
    <div className="rounded-[20px] bg-bg p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="figma-title text-p1">Lesson exercises</h2>
          <p className="figma-b2 mt-3 text-aaa">
            Manage lesson exercises for existing courses.
          </p>
        </div>

        <div className="rounded-[20px] bg-fff p-6">
          <label className="figma-b2 block text-p1" htmlFor="courseId">
            Course
          </label>

          <select
            id="courseId"
            value={selectedCourseId}
            onChange={(event) => setSelectedCourseId(event.target.value)}
            disabled={isLoadingCourses || courses.length === 0}
            className="figma-b2 mt-3 w-full rounded-[9px] border border-eee bg-fff px-4 py-3 text-p1 outline-none"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          {isLoadingCourses ? (
            <p className="figma-b3 mt-3 text-aaa">Loading courses...</p>
          ) : selectedCourse ? (
            <p className="figma-b3 mt-3 text-aaa">
              Course id: {selectedCourse.id}
            </p>
          ) : (
            <p className="figma-b3 mt-3 text-aaa">
              No courses are available.
            </p>
          )}
        </div>

        {errorMessage && (
          <p className="figma-b2 rounded-[9px] bg-fff p-4 text-p2">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleCreateLesson} className="rounded-[20px] bg-fff p-6">
          <div>
            <h3 className="figma-title text-p1">Create lesson</h3>
            <p className="figma-b2 mt-3 text-aaa">
              Add a new lesson exercise to the selected course.
            </p>
          </div>

          <div className="mt-5 grid gap-4">
            <div>
              <label className="figma-b2 block text-p1" htmlFor="lessonTitle">
                Title
              </label>

              <input
                id="lessonTitle"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="figma-b2 mt-3 w-full rounded-[9px] border border-eee bg-fff px-4 py-3 text-p1 outline-none"
                placeholder="Name of the lesson.."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  className="figma-b2 block text-p1"
                  htmlFor="durationMinutes"
                >
                  Duration minutes
                </label>

                <input
                  id="durationMinutes"
                  type="number"
                  min="1"
                  value={durationMinutes}
                  onChange={(event) => setDurationMinutes(event.target.value)}
                  className="figma-b2 mt-3 w-full rounded-[9px] border border-eee bg-fff px-4 py-3 text-p1 outline-none"
                  placeholder="Total length of the lesson in minuts.."
                />
              </div>

              <div>
                <label className="figma-b2 block text-p1" htmlFor="orderIndex">
                  Order
                </label>

                <input
                  id="orderIndex"
                  type="number"
                  min="1"
                  value={orderIndex}
                  onChange={(event) => setOrderIndex(event.target.value)}
                  className="figma-b2 mt-3 w-full rounded-[9px] border border-eee bg-fff px-4 py-3 text-p1 outline-none"
                  placeholder="Place in lesson order.."
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving || !selectedCourseId}
            className="figma-b2 mt-5 cursor-pointer rounded-[9px] bg-p2 px-6 py-4 text-fff disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Creating..." : "Create lesson"}
          </button>
        </form>

        {successMessage && (
          <p className="figma-b2 rounded-[9px] bg-fff p-4 text-p1">
            {successMessage}
          </p>
        )}

        <div className="rounded-[20px] bg-fff p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="figma-title text-p1">Lessons</h3>
            <p className="figma-b2 text-aaa">{lessons.length} lessons</p>
          </div>

          {isLoadingLessons ? (
            <p className="figma-b2 text-aaa">Loading lessons...</p>
          ) : lessons.length === 0 ? (
            <p className="figma-b2 text-aaa">
              No lesson exercises have been added for this course yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {lessons.map((lesson) => {
                const isEditing = editingLessonId === lesson.id;

                return (
                  <li
                    key={lesson.id}
                    className="rounded-[15px] border border-eee bg-bg p-5"
                  >
                    {isEditing ? (
                      <form onSubmit={handleUpdateLesson}>
                        <div className="grid gap-4">
                          <div>
                            <label
                              className="figma-b2 block text-p1"
                              htmlFor={`editTitle-${lesson.id}`}
                            >
                              Title
                            </label>

                            <input
                              id={`editTitle-${lesson.id}`}
                              value={editTitle}
                              onChange={(event) => setEditTitle(event.target.value)}
                              className="figma-b2 mt-3 w-full rounded-[9px] border border-eee bg-fff px-4 py-3 text-p1 outline-none"
                            />
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label
                                className="figma-b2 block text-p1"
                                htmlFor={`editDuration-${lesson.id}`}
                              >
                                Duration minutes
                              </label>

                              <input
                                id={`editDuration-${lesson.id}`}
                                type="number"
                                min="1"
                                value={editDurationMinutes}
                                onChange={(event) =>
                                  setEditDurationMinutes(event.target.value)
                                }
                                className="figma-b2 mt-3 w-full rounded-[9px] border border-eee bg-fff px-4 py-3 text-p1 outline-none"
                              />
                            </div>

                            <div>
                              <label
                                className="figma-b2 block text-p1"
                                htmlFor={`editOrder-${lesson.id}`}
                              >
                                Order
                              </label>

                              <input
                                id={`editOrder-${lesson.id}`}
                                type="number"
                                min="1"
                                value={editOrderIndex}
                                onChange={(event) =>
                                  setEditOrderIndex(event.target.value)
                                }
                                className="figma-b2 mt-3 w-full rounded-[9px] border border-eee bg-fff px-4 py-3 text-p1 outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 flex gap-3">
                          <button
                            type="submit"
                            disabled={isUpdating}
                            className="figma-b2 cursor-pointer rounded-[9px] bg-p2 px-5 py-3 text-fff disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isUpdating ? "Saving..." : "Save"}
                          </button>

                          <button
                            type="button"
                            onClick={cancelEditingLesson}
                            disabled={isUpdating}
                            className="figma-b2 cursor-pointer rounded-[9px] bg-eee px-5 py-3 text-aaa disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="figma-b1 text-p1">{lesson.title}</p>
                          <p className="figma-b3 mt-2 text-aaa">
                            Order {lesson.orderIndex} · {lesson.durationMinutes} min
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => startEditingLesson(lesson)}
                            className="figma-b3 cursor-pointer rounded-[9px] bg-p1 px-4 py-2 text-fff transition hover:opacity-90"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteLesson(lesson)}
                            disabled={deletingLessonId === lesson.id}
                            className="figma-b3 cursor-pointer rounded-[9px] bg-fff px-4 py-2 text-p2 transition hover:bg-p2 hover:text-fff disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingLessonId === lesson.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}