const Listing = require("../models/listing.js");
const ExpressError = require("../utils/expressError");

module.exports.index = async (req, res, next) => {
  try {
    const allListings = await Listing.find({}).populate("owner", "username");
    res.json({
      success: true,
      data: allListings
    });
  } catch (error) {
    next(error);
  }
};

module.exports.showListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
          select: "username"
        },
      })
      .populate("owner", "username");

    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }

    res.json({
      success: true,
      listing: listing
    });
  } catch (error) {
    next(error);
  }
};

module.exports.createListing = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;

    if (req.file) {
      newListing.image = {
        filename: req.file.filename,
        url: req.file.path
      };
    }

    await newListing.save();
    await newListing.populate("owner", "username");

    res.status(201).json({
      success: true,
      message: "New listing created successfully",
      listing: newListing
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate("owner", "username");

    if (!listing) {
      return next(new ExpressError(404, "Listing not found"));
    }

    if (req.file) {
      listing.image = {
        filename: req.file.filename,
        url: req.file.path
      };
      await listing.save();
    }

    res.json({
      success: true,
      message: "Listing updated successfully",
      listing: listing
    });
  } catch (error) {
    next(error);
  }
};

module.exports.destroyListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    
    if (!deletedListing) {
      return next(new ExpressError(404, "Listing not found"));
    }

    res.json({
      success: true,
      message: "Listing deleted successfully",
      data: deletedListing
    });
  } catch (error) {
    next(error);
  }
};
