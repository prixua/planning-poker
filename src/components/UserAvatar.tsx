import { User } from '@/types';

interface UserAvatarProps {
  user: User;
  showVote: boolean;
  isCurrentUser: boolean;
}

const getVoteDisplay = (vote?: string) => {
  switch (vote) {
    case 'coffee':
      return '☕';
    case 'question':
      return '?';
    default:
      return vote;
  }
};

export default function UserAvatar({ user, showVote, isCurrentUser }: UserAvatarProps) {
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  
  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg ${
      isCurrentUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
    }`}>
      {/* Avatar */}
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm
        ${user.role === 'voter' 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
          : 'bg-gradient-to-br from-gray-400 to-gray-600'
        }
      `}>
        {initials}
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.name}
            {isCurrentUser && <span className="text-blue-600"> (Você)</span>}
          </p>
          {user.role === 'spectator' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-800">
              👁️ Espectador
            </span>
          )}
        </div>
      </div>
      
      {/* Status de voto */}
      <div className="flex items-center space-x-2">
        {user.role === 'voter' && (
          <>
            {user.vote ? (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                {showVote && (
                  <span className="text-sm font-bold text-gray-700">
                    {getVoteDisplay(user.vote)}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-xs text-gray-500">Aguardando</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}