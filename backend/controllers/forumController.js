import Question from '../models/Question.js';
import Reply from '../models/Reply.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get all questions for a course
// @route   GET /api/courses/:courseId/forum
// @access  Private
export const getCourseQuestions = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const questions = await Question.find({ course: courseId })
      .populate('user', 'name email role avatar')
      .populate({
        path: 'replies',
        populate: { path: 'user', select: 'name role avatar' }
      })
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (error) {
    next(error);
  }
};

// @desc    Ask a question in a course forum
// @route   POST /api/courses/:courseId/forum
// @access  Private
export const askQuestion = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, content } = req.body;

    // Optional: Ensure user is enrolled or an instructor
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrollment && req.user.role === 'student') {
      res.status(403);
      throw new Error('You must be enrolled to ask a question');
    }

    const question = await Question.create({
      course: courseId,
      user: req.user._id,
      title,
      content,
    });

    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a question
// @route   POST /api/forum/:questionId/reply
// @access  Private
export const addReply = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404);
      throw new Error('Question not found');
    }

    const isInstructor = req.user.role === 'instructor' || req.user.role === 'admin' || req.user.role === 'teacher';

    const reply = await Reply.create({
      question: questionId,
      user: req.user._id,
      content,
      isInstructor,
    });

    res.status(201).json(reply);
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote a question
// @route   PUT /api/forum/:questionId/upvote
// @access  Private
export const upvoteQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404);
      throw new Error('Question not found');
    }

    // Check if user already upvoted
    if (question.upvotes.includes(req.user._id)) {
      // Remove upvote
      question.upvotes = question.upvotes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      // Add upvote
      question.upvotes.push(req.user._id);
    }

    await question.save();

    res.json(question);
  } catch (error) {
    next(error);
  }
};
