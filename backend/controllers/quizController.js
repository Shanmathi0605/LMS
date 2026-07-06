import Quiz from '../models/Quiz.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get quizzes for a course
// @route   GET /api/courses/:courseId/quizzes
// @access  Private
export const getCourseQuizzes = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    
    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (!enrollment) {
      res.status(403);
      throw new Error('Not enrolled in this course');
    }

    const quizzes = await Quiz.find({ course: courseId });
    
    // We shouldn't send correct answers to the frontend before they submit!
    // But for simplicity in this MVP, we will send the full object, and the frontend will grade it,
    // OR we can grade it on the backend. Grading on the backend is safer.
    // Let's strip the correct answers from the payload
    const sanitizedQuizzes = quizzes.map(quiz => {
      const q = quiz.toObject();
      q.questions.forEach(question => delete question.correctAnswerIndex);
      return q;
    });

    res.json(sanitizedQuizzes);
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a quiz and get score
// @route   POST /api/quizzes/:id/submit
// @access  Private
export const submitQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const { answers } = req.body; // Array of selected indices, e.g. [1, 0, 3]

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      res.status(404);
      throw new Error('Quiz not found');
    }

    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswerIndex) {
        score++;
      }
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);
    const passed = percentage >= quiz.passingScore;

    // Optional: Save score to a QuizResult model or Enrollment model.
    // For now, we just return the result.

    res.json({
      score,
      total: quiz.questions.length,
      percentage,
      passed,
      passingScore: quiz.passingScore
    });
  } catch (error) {
    next(error);
  }
};
