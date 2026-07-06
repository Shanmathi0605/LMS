import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    completedLessons: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Lesson',
      }
    ],
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastWatchedLesson: {
      type: mongoose.Schema.ObjectId,
      ref: 'Lesson',
    }
  },
  { timestamps: true }
);

// Prevent duplicate enrollments
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
