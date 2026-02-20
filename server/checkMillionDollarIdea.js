const checkMillionDollarIdea = (req, res, next) => {
  const { numWeeks, weeklyRevenue } = req.body;

  // Convert to numbers (they might be strings from JSON)
  const weeks = Number(numWeeks);
  const revenue = Number(weeklyRevenue);

  // Validate input
  if (!weeks || !revenue || isNaN(weeks) || isNaN(revenue)) {
    return res.status(400).send('Invalid input');
  }

  const totalValue = weeks * revenue;

  if (totalValue < 1000000) {
    return res.status(400).send('Idea must be worth at least one million dollars!');
  }

  // If valid, continue to next middleware or route handler
  next();
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
