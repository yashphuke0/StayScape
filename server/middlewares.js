const Listing = require("./models/listing");
const Review = require("./models/reviews");
const ExpressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./utils/schema.js");
const { authenticateToken } = require("./middleware/auth");

// JWT-based authentication middleware
const isLoggedIn = authenticateToken;

const isOwner = async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    
    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }
    
    if (!listing.owner.equals(req.user._id)) {
      return next(new ExpressError(403, "You don't have permission to do that!"));
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(400, errMsg));
  }
  next();
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(400, errMsg));
  }
  next();
};

const isReviewAuthor = async (req, res, next) => {
  try {
    let { reviewId } = req.params;
    let review = await Review.findById(reviewId);
    
    if (!review) {
      return next(new ExpressError(404, "Review not found"));
    }
    
    if (!review.author.equals(req.user._id)) {
      return next(new ExpressError(403, "You are not the author of this review!"));
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isLoggedIn,
  isOwner,
  validateListing,
  validateReview,
  isReviewAuthor,
};
