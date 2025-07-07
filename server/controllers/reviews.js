const Review = require('../models/reviews');
const Listing = require('../models/listing');
const ExpressError = require('../utils/expressError');

module.exports.createReview = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }

    const newReview = new Review(req.body);
    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    await newReview.populate('author', 'username');

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: newReview
    });
  } catch (error) {
    next(error);
  }
};

module.exports.destroyReview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;

    const listing = await Listing.findById(id);
    const review = await Review.findById(reviewId);

    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }

    if (!review) {
      return next(new ExpressError(404, "Review not found"));
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};