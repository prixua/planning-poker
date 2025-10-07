import { VoteValue } from '@/types';

interface VotingCardProps {
  value: VoteValue;
  isSelected: boolean;
  isRevealed: boolean;
  onClick: () => void;
  disabled: boolean;
}

const getCardContent = (value: VoteValue) => {
  switch (value) {
    case 'coffee':
      return '☕';
    case 'question':
      return '?';
    default:
      return value;
  }
};

const getCardColor = (value: VoteValue, isSelected: boolean, disabled: boolean) => {
  if (disabled) return 'bg-card-disabled-bg text-card-disabled';
  if (isSelected) return 'bg-primary text-white border-primary';
  
  switch (value) {
    case 'coffee':
      return 'bg-warning-100 text-warning-800 hover:bg-warning-200';
    case 'question':
      return 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200';
    default:
      return 'bg-card-bg text-gray-800 hover:bg-card-hover';
  }
};

export default function VotingCard({ value, isSelected, isRevealed, onClick, disabled }: VotingCardProps) {
  const cardContent = getCardContent(value);
  const cardColor = getCardColor(value, isSelected, disabled);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        voting-card aspect-[3/4] min-w-[50px] max-w-[80px] w-full rounded-lg 
        ${cardColor}
        flex items-center justify-center text-lg font-bold
        transition-colors-smooth transform hover:scale-105
        disabled:cursor-not-allowed disabled:transform-none
        ${isSelected ? 'shadow-card-hover scale-105' : 'shadow-card'}
        ${disabled ? 'disabled' : ''}
        ${isSelected ? 'selected' : ''}
      `}
    >
      {isRevealed || !isSelected ? (
        <span className={value === 'coffee' || value === 'question' ? 'text-2xl' : ''}>
          {cardContent}
        </span>
      ) : (
        <div className="w-full h-full bg-primary rounded-md flex items-center justify-center">
          <div className="w-6 h-8 bg-white rounded-sm opacity-20"></div>
        </div>
      )}
    </button>
  );
}