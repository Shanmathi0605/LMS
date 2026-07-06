import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
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
    title: {
      type: String,
      required: [true, 'Please add a title for your question'],
      trim: true,
      maxlength: 150,
    },
    content: {
      type: String,
      required: [true, 'Please add the details of your question'],
    },
    upvotes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to get replies for this question
questionSchema.virtual('replies', {
  ref: 'Reply',
  localField: '_id',
  foreignField: 'question',
  justOne: false,
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
