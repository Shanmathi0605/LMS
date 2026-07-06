import mongoose from 'mongoose';

const replySchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.ObjectId,
      ref: 'Question',
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Please add the details of your reply'],
    },
    isInstructor: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Reply = mongoose.model('Reply', replySchema);
export default Reply;
