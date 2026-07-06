import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a course title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    thumbnail: {
      type: String,
      default: 'no-photo.jpg',
    },
    instructor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    duration: {
      type: Number, // in hours or minutes
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Cascade delete lessons when a course is deleted
courseSchema.pre('remove', async function (next) {
  await this.model('Lesson').deleteMany({ course: this._id });
  await this.model('Quiz').deleteMany({ course: this._id });
  next();
});

// Reverse populate with virtuals
courseSchema.virtual('lessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'course',
  justOne: false,
});

courseSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'course',
  justOne: false,
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
