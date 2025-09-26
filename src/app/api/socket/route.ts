import { NextRequest } from 'next/server';
import { Server } from 'socket.io';
import { Room, User, VoteValue, UserRole } from '@/types';

const rooms: Map<string, Room> = new Map();

// Função para gerar ID único para usuário
const generateUserId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Função para criar nova sala
const createRoom = (roomId: string): Room => {
  const room: Room = {
    id: roomId,
    users: [],
    votesRevealed: false,
    createdAt: new Date()
  };
  rooms.set(roomId, room);
  return room;
};

export async function GET(req: NextRequest) {
  if (req.headers.get('upgrade') === 'websocket') {
    // Para desenvolvimento, vamos criar um servidor Socket.io simples
    return new Response('Socket.io server should be running separately', { status: 200 });
  }
  
  return new Response('Planning Poker Socket.io API', { status: 200 });
}

// Esta função será usada em um servidor Socket.io separado
export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', ({ roomId, userName, role }: { roomId: string; userName: string; role: UserRole }) => {
      // Verificar se a sala existe, se não, criar
      let room = rooms.get(roomId);
      if (!room) {
        room = createRoom(roomId);
      }

      // Verificar se o usuário já está na sala
      const existingUser = room.users.find(u => u.name === userName);
      if (existingUser) {
        socket.emit('error', 'Nome de usuário já está em uso nesta sala');
        return;
      }

      // Criar novo usuário
      const newUser: User = {
        id: generateUserId(),
        name: userName,
        role,
        hasVoted: false
      };

      // Adicionar usuário à sala
      room.users.push(newUser);
      socket.join(roomId);

      // Armazenar informações do socket
      socket.data.roomId = roomId;
      socket.data.userId = newUser.id;

      // Notificar todos na sala
      io.to(roomId).emit('room-updated', room);
      
      console.log(`User ${userName} joined room ${roomId} as ${role}`);
    });

    socket.on('vote-cast', ({ userId, vote }: { userId: string; vote: VoteValue }) => {
      const roomId = socket.data.roomId;
      const room = rooms.get(roomId);
      
      if (!room) {
        socket.emit('error', 'Sala não encontrada');
        return;
      }

      // Encontrar o usuário
      const user = room.users.find(u => u.id === userId);
      if (!user || user.role !== 'voter') {
        socket.emit('error', 'Usuário não pode votar');
        return;
      }

      // Se os votos já foram revelados, não permitir mais votos
      if (room.votesRevealed) {
        socket.emit('error', 'Votos já foram revelados');
        return;
      }

      // Registrar voto
      user.vote = vote;
      user.hasVoted = true;

      // Atualizar sala
      rooms.set(roomId, room);

      // Notificar todos na sala
      io.to(roomId).emit('room-updated', room);
      
      console.log(`User ${user.name} voted ${vote} in room ${roomId}`);
    });

    socket.on('reveal-votes', () => {
      const roomId = socket.data.roomId;
      const room = rooms.get(roomId);
      
      if (!room) {
        socket.emit('error', 'Sala não encontrada');
        return;
      }

      // Revelar votos
      room.votesRevealed = true;
      rooms.set(roomId, room);

      // Notificar todos na sala
      io.to(roomId).emit('votes-revealed', room);
      
      console.log(`Votes revealed in room ${roomId}`);
    });

    socket.on('reset-votes', () => {
      const roomId = socket.data.roomId;
      const room = rooms.get(roomId);
      
      if (!room) {
        socket.emit('error', 'Sala não encontrada');
        return;
      }

      // Resetar votos
      room.users.forEach(user => {
        if (user.role === 'voter') {
          user.hasVoted = false;
          user.vote = undefined;
        }
      });
      room.votesRevealed = false;
      rooms.set(roomId, room);

      // Notificar todos na sala
      io.to(roomId).emit('room-updated', room);
      
      console.log(`Votes reset in room ${roomId}`);
    });

    socket.on('disconnect', () => {
      const roomId = socket.data.roomId;
      const userId = socket.data.userId;
      
      if (roomId && userId) {
        const room = rooms.get(roomId);
        if (room) {
          // Remover usuário da sala
          room.users = room.users.filter(u => u.id !== userId);
          
          // Se a sala estiver vazia, removê-la
          if (room.users.length === 0) {
            rooms.delete(roomId);
            console.log(`Room ${roomId} deleted (empty)`);
          } else {
            rooms.set(roomId, room);
            // Notificar usuários restantes
            io.to(roomId).emit('room-updated', room);
          }
        }
      }
      
      console.log('User disconnected:', socket.id);
    });
  });
}