const Review = require('../models/Review');
const Room = require('../models/Room');
const MessPlan = require('../models/MessPlan');

// Recalculate and persist rating stats for a target model/id from Review collection
async function updateTargetRatings(targetModel, targetId) {
  const match = { targetModel, targetId };

  const stats = await Review.aggregate([
    { $match: match },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);

  const average = stats[0]?.avg || 0;
  const count = stats[0]?.count || 0;

  if (targetModel === 'Room') {
    await Room.findByIdAndUpdate(targetId, {
      'ratings.average': average,
      'ratings.count': count,
      'ratings.totalRatingScore': Math.round(average * count),
      'ratings.totalRatings': count
    });
  } else if (targetModel === 'MessPlan') {
    await MessPlan.findByIdAndUpdate(targetId, {
      'ratings.average': average,
      'ratings.count': count
    });
  }
}

module.exports = { updateTargetRatings };


