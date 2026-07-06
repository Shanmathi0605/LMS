import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

// @desc    Get user enrollments
// @route   GET /api/enrollments
// @access  Private
export const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course', 'title thumbnail')
      .sort('-createdAt');
    res.json(enrollments);
  } catch (error) {
    next(error);
  }
};

// @desc    Check if user is enrolled in a specific course
// @route   GET /api/enrollments/check/:courseId
// @access  Private
export const checkEnrollment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });
    
    if (enrollment) {
      res.json({ isEnrolled: true });
    } else {
      res.json({ isEnrolled: false });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update progress for a lesson
// @route   PUT /api/enrollments/:courseId/progress
// @access  Private
export const updateProgress = async (req, res, next) => {
  try {
    const { lessonId } = req.body;
    const courseId = req.params.courseId;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (!enrollment) {
      res.status(404);
      throw new Error('Enrollment not found');
    }

    const course = await Course.findById(courseId).populate('lessons');
    
    // Add to completed if not already there
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    enrollment.lastWatchedLesson = lessonId;

    // Calculate percentage
    const totalLessons = course.lessons ? course.lessons.length : 0;
    const completedCount = enrollment.completedLessons.length;
    
    if (totalLessons > 0) {
      enrollment.progressPercentage = Math.round((completedCount / totalLessons) * 100);
    } else {
      enrollment.progressPercentage = 100;
    }

    if (enrollment.progressPercentage === 100) {
      enrollment.status = 'completed';
    }

    await enrollment.save();

    res.json(enrollment);
  } catch (error) {
    next(error);
  }
};
