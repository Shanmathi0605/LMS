import User from '../models/User.js';

// @desc    Add course to wishlist
// @route   POST /api/users/wishlist/:courseId
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const courseId = req.params.courseId;

    if (!user.wishlist.includes(courseId)) {
      user.wishlist.push(courseId);
      await user.save();
    }
    
    await user.populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Remove course from wishlist
// @route   DELETE /api/users/wishlist/:courseId
// @access  Private
export const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const courseId = req.params.courseId;

    user.wishlist = user.wishlist.filter(id => id.toString() !== courseId);
    await user.save();
    
    await user.populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
