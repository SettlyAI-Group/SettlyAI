import React from 'react';
import ScoreCard from '../ScoreCard/ScoreCard';
import { useSafetyScores } from '../../hooks/useSafetyScores';
import { getCrimeRateLevel, getAffordabilityLevel, getGrowthLevel } from '../../utils/scoreHelpers';
import './SafetyScores.css';

const SafetyScores = ({ suburbId, className }) => {
  const { data, loading, error } = useSafetyScores(suburbId);

  if (loading) {
    return (
      <div className={`safety-scores ${className || ''}`}>
        <div className="safety-scores__header">
          <h2 className="safety-scores__title">Safety & Scores</h2>
        </div>
        <div className="safety-scores__loading">
          <div className="safety-scores__spinner" />
          <p>Loading safety scores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`safety-scores ${className || ''}`}>
        <div className="safety-scores__header">
          <h2 className="safety-scores__title">Safety & Scores</h2>
        </div>
        <div className="safety-scores__error">
          <p>Error loading safety scores: {error}</p>
          <button
            className="safety-scores__retry-btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const scoreCards = [
    {
      title: 'Crime Rate',
      value: data.crimeRate,
      maxValue: 10,
      unit: '1,000',
      color: 'green',
      level: getCrimeRateLevel(data.crimeRate),
      icon: '🛡️'
    },
    {
      title: 'Affordability Score',
      value: data.affordabilityScore,
      maxValue: 10,
      unit: '10',
      color: 'purple',
      level: getAffordabilityLevel(data.affordabilityScore),
      icon: '💰'
    },
    {
      title: 'Growth Potential',
      value: data.growthPotential,
      maxValue: 10,
      unit: '10',
      color: 'blue',
      level: getGrowthLevel(data.growthPotential),
      icon: '📈'
    }
  ];

  return (
    <div className={`safety-scores ${className || ''}`}>
      <div className="safety-scores__header">
        <h2 className="safety-scores__title">Safety & Scores</h2>
      </div>

      <div className="safety-scores__cards">
        {scoreCards.map((card, index) => (
          <ScoreCard
            key={index}
            title={card.title}
            value={card.value}
            maxValue={card.maxValue}
            unit={card.unit}
            color={card.color}
            level={card.level}
            icon={card.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default SafetyScores;