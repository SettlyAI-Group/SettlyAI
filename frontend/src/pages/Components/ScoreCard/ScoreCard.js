import React from 'react';
import './ScoreCard.css';

const ScoreCard = ({
  title,
  value,
  maxValue,
  unit,
  color,
  level,
  icon
}) => {
  const percentage = (value / maxValue) * 100;

  return (
    <div className={`score-card score-card--${color}`}>
      <div className="score-card__header">
        <h3 className="score-card__title">{title}</h3>
        {icon && <span className="score-card__icon">{icon}</span>}
      </div>

      <div className="score-card__content">
        <div className="score-card__value">
          <span className="score-card__number">{value}</span>
          <span className="score-card__unit">/ {unit}</span>
        </div>

        <div className="score-card__level">{level}</div>

        <div className="score-card__progress">
          <div
            className={`score-card__progress-bar score-card__progress-bar--${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;