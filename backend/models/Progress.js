import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
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
    completedLessons: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Lesson',
      },
    ],
    quizScores: [
      {
        quiz: { type: mongoose.Schema.ObjectId, ref: 'Quiz' },
        score: { type: Number },
        passed: { type: Boolean },
      },
    ],
    percentageCompleted: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Unique progress tracking per user per course
progressSchema.index({ student: 1, course: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
