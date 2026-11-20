
import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/api";

// ==========================================
// Create Context
// ==========================================

const CourseContext = createContext();

// ==========================================
// Course Provider
// ==========================================

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==========================================
  // Get All Courses
  // ==========================================

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get("/courses");

      setCourses(response.data || []);
    } catch (err) {
      console.error("Fetch Courses Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch courses"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Get Single Course
  // ==========================================

  const getCourse = async (id) => {
    try {
      setError(null);

      const response = await API.get(`/courses/${id}`);

      return response.data;
    } catch (err) {
      console.error("Get Course Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch course"
      );

      throw err;
    }
  };

  // ==========================================
  // Create Course
  // ==========================================

  const createCourse = async (courseData) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();

      formData.append("title", courseData.title);
      formData.append("code", courseData.code);
      formData.append("department", courseData.department);
      formData.append("semester", courseData.semester);
      formData.append(
        "description",
        courseData.description || ""
      );

      // Teacher ID
      if (courseData.teacher) {
        formData.append(
          "teacher",
          courseData.teacher
        );
      }

      // Material File
      if (courseData.material) {
        formData.append(
          "material",
          courseData.material
        );
      }

      const response = await API.post(
        "/courses",
        formData
      );

      setCourses((prevCourses) => [
        response.data,
        ...prevCourses,
      ]);

      return response.data;
    } catch (err) {
      console.error("Create Course Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create course"
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Update Course
  // ==========================================

  const updateCourse = async (id, courseData) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();

      formData.append("title", courseData.title);
      formData.append("code", courseData.code);
      formData.append(
        "department",
        courseData.department
      );
      formData.append(
        "semester",
        courseData.semester
      );
      formData.append(
        "description",
        courseData.description || ""
      );

      // Teacher
      if (courseData.teacher) {
        formData.append(
          "teacher",
          courseData.teacher
        );
      }

      // New Material
      if (courseData.material) {
        formData.append(
          "material",
          courseData.material
        );
      }

      const response = await API.put(
        `/courses/${id}`,
        formData
      );

      // Update course inside state
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === id
            ? response.data
            : course
        )
      );

      return response.data;
    } catch (err) {
      console.error("Update Course Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update course"
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Delete Course
  // ==========================================

  const deleteCourse = async (id) => {
    try {
      setLoading(true);
      setError(null);

      await API.delete(`/courses/${id}`);

      setCourses((prevCourses) =>
        prevCourses.filter(
          (course) => course._id !== id
        )
      );
    } catch (err) {
      console.error("Delete Course Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete course"
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Initial Fetch
  // ==========================================

  useEffect(() => {
    fetchCourses();
  }, []);

  // ==========================================
  // Context Value
  // ==========================================

  const value = {
    courses,
    loading,
    error,

    fetchCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

// ==========================================
// Custom Hook
// ==========================================

export const useCourses = () => {
  const context = useContext(CourseContext);

  if (!context) {
    throw new Error(
      "useCourses must be used inside CourseProvider"
    );
  }

  return context;
};

