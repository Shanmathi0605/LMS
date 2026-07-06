import Course from '../models/Course.js';
import Review from '../models/Review.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    
    let query = { isPublished: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const courses = await Course.find(query).populate('instructor', 'name');
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name')
      .populate('lessons');

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Teacher
export const createCourse = async (req, res, next) => {
  try {
    req.body.instructor = req.user._id;

    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Teacher
export const updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Make sure user is course instructor
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to update this course');
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Teacher/Admin
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    // Make sure user is course instructor or admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to delete this course');
    }

    await course.deleteOne();

    res.json({ message: 'Course removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a course
// @route   GET /api/courses/:id/reviews
// @access  Public
export const getCourseReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ course: req.params.id }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Add review to a course
// @route   POST /api/courses/:id/reviews
// @access  Private
export const addCourseReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    const alreadyReviewed = await Review.findOne({
      course: courseId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Course already reviewed');
    }

    const review = await Review.create({
      rating: Number(rating),
      comment,
      course: courseId,
      user: req.user._id,
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};
