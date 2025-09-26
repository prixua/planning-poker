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
  if (disabled) return 'bg-gray-200 text-gray-400';
  if (isSelected) return 'bg-blue-600 text-white';
  
  switch (value) {
    case 'coffee':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
    case 'question':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    default:
      return 'bg-white text-gray-800 hover:bg-gray-50';
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
        aspect-[3/4] min-w-[50px] max-w-[80px] w-full rounded-lg border-2 border-gray-300 
        ${cardColor}
        flex items-center justify-center text-lg font-bold
        transition-all duration-200 transform hover:scale-105 hover:shadow-md
        disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        ${isSelected ? 'border-blue-600 shadow-lg' : ''}
      `}
    >
      {isRevealed || !isSelected ? (
        <span className={value === 'coffee' || value === 'question' ? 'text-2xl' : ''}>
          {cardContent}
        </span>
      ) : (
        <div className="w-full h-full bg-blue-600 rounded-md flex items-center justify-center">
          <div className="w-6 h-8 bg-white rounded-sm opacity-20"></div>
        </div>
      )}
    </button>
  );
}