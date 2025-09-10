import { Home, AttachMoney, TrendingUp } from '@mui/icons-material';
import { FeatureCard, FeatureCardGridContainer } from './components';

const featureCards = [
  {
    title: 'SettlyHome',
    description:
      "Whether you're exploring suburbs, planning your budget, or just figuring things out — Settly helps make it all easier.",
    icon: <Home />,
    ctaText: 'Let AI Guide me',
    onClick: () => console.log('Navigate to home features'),
  },
  {
    title: 'SettlyLoan',
    description:
      'Compare fixed vs variable, estimate repayments, and test loan stress scenarios.',
    icon: <AttachMoney />,
    ctaText: 'Simulate Loan',
    onClick: () => console.log('Navigate to loan calculator'),
  },
  {
    title: 'SettlySuper',
    description: 'Use Your Super Wisely to Boost Your Home Plan',
    icon: <TrendingUp />,
    ctaText: 'Compare Super Strategy',
    onClick: () => console.log('Navigate to super optimization'),
  },
];

const FeatureCardsSection = () => (
  <FeatureCardGridContainer>
    {featureCards.map((card, index) => (
      <FeatureCard
        key={index}
        title={card.title}
        description={card.description}
        icon={card.icon}
        ctaText={card.ctaText}
        onClick={card.onClick}
      />
    ))}
  </FeatureCardGridContainer>
);

export default FeatureCardsSection;
