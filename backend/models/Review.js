import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please add a rating between 1 and 5'],
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment text'],
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent user from submitting more than one review per course
reviewSchema.index({ course: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
reviewSchema.statics.getAverageRating = async function (courseId) {
  const obj = await this.aggregate([
    {
      $match: { course: courseId },
    },
    {
      $group: {
        _id: '$course',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('Course').findByIdAndUpdate(courseId, {
      averageRating: obj[0] ? obj[0].averageRating : 0,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.course);
});

// Call getAverageRating before remove
reviewSchema.pre('remove', function () {
  this.constructor.getAverageRating(this.course);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
