'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Room, User, VoteValue, UserRole } from '@/types';
import VotingCard from '@/components/VotingCard';
import UserAvatar from '@/components/UserAvatar';

const FIBONACCI_VALUES: VoteValue[] = ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89'];
const SPECIAL_VALUES: VoteValue[] = ['coffee', 'question'];

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  const userName = searchParams.get('name') || '';
  const userRole = (searchParams.get('role') || 'voter') as UserRole;
  const isCreator = searchParams.get('creator') === 'true';

  const [room, setRoom] = useState<Room | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedVote, setSelectedVote] = useState<VoteValue | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showJoinForm, setShowJoinForm] = useState(!userName);
  const [formUserName, setFormUserName] = useState('');
  const [formUserRole, setFormUserRole] = useState<UserRole>('voter');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Só conectar se tivermos um nome de usuário
    if (!userName || showJoinForm) return;

    // Conectar ao servidor Socket.io
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('connect', () => {
      setConnected(true);
      // Entrar na sala
      socketRef.current?.emit('join-room', {
        roomId,
        userName,
        role: userRole
      });
    });

    socketRef.current.on('room-updated', (updatedRoom: Room) => {
      setRoom(updatedRoom);
      // Buscar por socket.id ou por nome como fallback
      const user = updatedRoom.users.find(u => u.id === socketRef.current?.id) || 
                   updatedRoom.users.find(u => u.name === userName);
      setCurrentUser(user || null);
      
      // Se o usuário não votou mais (após reset), limpar voto selecionado local
      if (user && !user.hasVoted) {
        setSelectedVote(null);
      }
    });

    socketRef.current.on('votes-revealed', (updatedRoom: Room) => {
      setRoom(updatedRoom);
    });

    socketRef.current.on('error', (errorMessage: string) => {
      setError(errorMessage);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId, userName, userRole, showJoinForm]);

  const handleJoinRoom = () => {
    if (!formUserName.trim()) {
      alert('Por favor, insira seu nome');
      return;
    }

    setShowJoinForm(false);
    
    // Conectar ao servidor Socket.io
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('connect', () => {
      setConnected(true);
      // Entrar na sala
      socketRef.current?.emit('join-room', {
        roomId,
        userName: formUserName,
        role: formUserRole
      });
    });

    socketRef.current.on('room-updated', (updatedRoom: Room) => {
      setRoom(updatedRoom);
      // Buscar por socket.id ou por nome como fallback
      const user = updatedRoom.users.find(u => u.id === socketRef.current?.id) || 
                   updatedRoom.users.find(u => u.name === formUserName);
      setCurrentUser(user || null);
      
      // Se o usuário não votou mais (após reset), limpar voto selecionado local
      if (user && !user.hasVoted) {
        setSelectedVote(null);
      }
    });

    socketRef.current.on('votes-revealed', (updatedRoom: Room) => {
      setRoom(updatedRoom);
    });

    socketRef.current.on('error', (errorMessage: string) => {
      setError(errorMessage);
      setShowJoinForm(true);
      setConnected(false);
    });
  };

  const handleVote = (vote: VoteValue) => {
    if (currentUser?.role !== 'voter' || room?.votesRevealed) return;
    
    setSelectedVote(vote);
    socketRef.current?.emit('vote-cast', { userId: currentUser.id, vote });
  };

  const handleRevealVotes = () => {
    socketRef.current?.emit('reveal-votes');
  };

  const handleResetVotes = () => {
    setSelectedVote(null);
    socketRef.current?.emit('reset-votes');
  };

  const copyRoomLink = () => {
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url);
    alert('Link da sala copiado para a área de transferência!');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro</h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  // Mostrar formulário de entrada se não tiver nome
  if (showJoinForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Entrar na Sala</h1>
            <p className="text-gray-600">Código da sala: <span className="font-bold text-blue-600">{roomId}</span></p>
          </div>

          <div className="space-y-6">
            {/* Nome do usuário */}
            <div>
              <label htmlFor="formUserName" className="block text-sm font-medium text-gray-700 mb-2">
                Seu Nome
              </label>
              <input
                type="text"
                id="formUserName"
                value={formUserName}
                onChange={(e) => setFormUserName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite seu nome"
                onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
              />
            </div>

            {/* Papel do usuário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Participação
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="formRole"
                    value="voter"
                    checked={formUserRole === 'voter'}
                    onChange={(e) => setFormUserRole(e.target.value as UserRole)}
                    className="mr-2"
                  />
                  <span className="text-sm">Votante</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="formRole"
                    value="spectator"
                    checked={formUserRole === 'spectator'}
                    onChange={(e) => setFormUserRole(e.target.value as UserRole)}
                    className="mr-2"
                  />
                  <span className="text-sm">Espectador</span>
                </label>
              </div>
            </div>

            {/* Botão entrar */}
            <button
              onClick={handleJoinRoom}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Entrar na Sala
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!connected || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Conectando...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  const voters = room.users.filter(user => user.role === 'voter');
  const spectators = room.users.filter(user => user.role === 'spectator');
  const allVoted = voters.length > 0 && voters.every(user => user.hasVoted);
  const someVoted = voters.some(user => user.hasVoted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Planning Poker</h1>
              <p className="text-gray-600">Sala: {roomId}</p>
            </div>
            <button
              onClick={copyRoomLink}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Compartilhar Sala
            </button>
          </div>

          {/* Controles */}
          <div className="flex space-x-4">
            <button
              onClick={handleRevealVotes}
              disabled={!someVoted || room.votesRevealed}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              title={!someVoted ? "Pelo menos um votante deve votar para revelar" : ""}
            >
              Revelar Votos {allVoted ? "(Todos votaram)" : someVoted ? `(${voters.filter(u => u.hasVoted).length}/${voters.length} votaram)` : ""}
            </button>
            <button
              onClick={handleResetVotes}
              className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Nova Votação
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Área de votação */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {currentUser?.role === 'voter' ? 'Escolha seu voto' : 'Acompanhe a votação'}
            </h2>
            
            {currentUser?.role === 'voter' && (
              <>
                {/* Cards Fibonacci */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Sequência de Fibonacci</h3>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-11 gap-2">
                    {FIBONACCI_VALUES.map((value) => (
                      <VotingCard
                        key={value}
                        value={value}
                        isSelected={selectedVote === value}
                        isRevealed={room.votesRevealed}
                        onClick={() => handleVote(value)}
                        disabled={room.votesRevealed}
                      />
                    ))}
                  </div>
                </div>

                {/* Cards Especiais */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Cartas Especiais</h3>
                  <div className="flex space-x-2">
                    {SPECIAL_VALUES.map((value) => (
                      <VotingCard
                        key={value}
                        value={value}
                        isSelected={selectedVote === value}
                        isRevealed={room.votesRevealed}
                        onClick={() => handleVote(value)}
                        disabled={room.votesRevealed}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Status da votação */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">
                  {voters.filter(u => u.hasVoted).length} de {voters.length} votaram
                </span>
                <div className="flex space-x-1">
                  {voters.map((user) => (
                    <div
                      key={user.id}
                      className={`w-3 h-3 rounded-full ${
                        user.hasVoted ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      title={user.name}
                    />
                  ))}
                </div>
              </div>
              {someVoted && !allVoted && !room.votesRevealed && (
                <div className="text-xs text-blue-600 mt-1">
                  💡 Dica: Você pode revelar os votos mesmo sem todos votarem
                </div>
              )}
            </div>
          </div>

          {/* Participantes */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Participantes</h2>
            
            {/* Votantes */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Votantes ({voters.length})</h3>
              <div className="space-y-2">
                {voters.map((user) => (
                  <UserAvatar
                    key={user.id}
                    user={user}
                    showVote={room.votesRevealed}
                    isCurrentUser={user.id === currentUser?.id}
                  />
                ))}
              </div>
            </div>

            {/* Espectadores */}
            {spectators.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Espectadores ({spectators.length})</h3>
                <div className="space-y-2">
                  {spectators.map((user) => (
                    <UserAvatar
                      key={user.id}
                      user={user}
                      showVote={false}
                      isCurrentUser={user.id === currentUser?.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resultados */}
        {room.votesRevealed && (
          <div className="mt-6 bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resultados</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {voters.map((user) => (
                <div key={user.id} className="text-center">
                  <VotingCard
                    value={user.vote || 'question'}
                    isSelected={false}
                    isRevealed={true}
                    onClick={() => {}}
                    disabled={true}
                  />
                  <p className="mt-2 text-sm text-gray-700 truncate">{user.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}