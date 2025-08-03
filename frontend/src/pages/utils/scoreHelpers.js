export const getCrimeRateLevel = (rate) => {
  if (rate <= 2.0) return 'Very Low';
  if (rate <= 4.0) return 'Low';
  if (rate <= 6.0) return 'Moderate';
  return 'High';
};

export const getAffordabilityLevel = (score) => {
  if (score >= 8.0) return 'Excellent';
  if (score >= 6.5) return 'Good';
  if (score >= 5.0) return 'Fair';
  return 'Poor';
};

export const getGrowthLevel = (score) => {
  if (score >= 8.0) return 'High';
  if (score >= 6.5) return 'Moderate';
  if (score >= 5.0) return 'Low';
  return 'Very Low';
};
