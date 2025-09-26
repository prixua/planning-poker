'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';

export default function HomePage() {
  const [isCreating, setIsCreating] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('voter');
  const router = useRouter();

  const generateRoomId = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleCreateRoom = () => {
    if (!userName.trim()) {
      alert('Por favor, insira seu nome');
      return;
    }
    
    const roomId = generateRoomId();
    router.push(`/room/${roomId}?name=${encodeURIComponent(userName)}&role=${userRole}`);
  };

  const handleJoinRoom = () => {
    if (!userName.trim()) {
      alert('Por favor, insira seu nome');
      return;
    }
    
    if (!joinRoomId.trim() || joinRoomId.length !== 4) {
      alert('Por favor, insira um código de sala válido (4 dígitos)');
      return;
    }
    
    router.push(`/room/${joinRoomId}?name=${encodeURIComponent(userName)}&role=${userRole}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Planning Poker</h1>
          <p className="text-gray-600">Sistema de votação para equipes ágeis</p>
        </div>

        <div className="space-y-6">
          {/* Nome do usuário */}
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
              Seu Nome
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite seu nome"
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
                  name="role"
                  value="voter"
                  checked={userRole === 'voter'}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="mr-2"
                />
                <span className="text-sm">Votante</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="spectator"
                  checked={userRole === 'spectator'}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="mr-2"
                />
                <span className="text-sm">Espectador</span>
              </label>
            </div>
          </div>

          {/* Opções de sala */}
          <div className="border-t pt-6">
            {!isCreating ? (
              <div className="space-y-4">
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Criar Nova Sala
                </button>
                
                <div className="text-center text-gray-500">ou</div>
                
                <div>
                  <input
                    type="text"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3"
                    placeholder="Código da sala (4 dígitos)"
                    maxLength={4}
                  />
                  <button
                    onClick={handleJoinRoom}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Entrar na Sala
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleCreateRoom}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Confirmar Criação da Sala
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Voltar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}