const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://0.0.0.0:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const rooms = new Map();

// Função para gerar ID único para usuário
const generateUserId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Função para criar nova sala
const createRoom = (roomId) => {
  const room = {
    id: roomId,
    users: [],
    votesRevealed: false,
    createdAt: new Date()
  };
  rooms.set(roomId, room);
  return room;
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, userName, role }) => {
    // Verificar se a sala existe, se não, criar
    let room = rooms.get(roomId);
    if (!room) {
      room = createRoom(roomId);
    }

    // Verificar se o usuário já está na sala pelo nome
    const existingUser = room.users.find(u => u.name === userName);
    if (existingUser) {
      socket.emit('error', 'Nome de usuário já está em uso nesta sala');
      return;
    }

    // Criar novo usuário com socket.id como identificador único
    const newUser = {
      id: socket.id, // Usar socket.id como ID único
      name: userName,
      role,
      hasVoted: false
    };

    // Adicionar usuário à sala
    room.users.push(newUser);
    socket.join(roomId);

    // Armazenar informações do socket
    socket.data = { roomId, userId: socket.id }; // Usar socket.id como userId

    // Notificar todos na sala
    io.to(roomId).emit('room-updated', room);
    
    console.log(`User ${userName} joined room ${roomId} as ${role}`);
  });

  socket.on('vote-cast', ({ userId, vote }) => {
    const roomId = socket.data?.roomId;
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
    const roomId = socket.data?.roomId;
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
    const roomId = socket.data?.roomId;
    const room = rooms.get(roomId);
    
    if (!room) {
      socket.emit('error', 'Sala não encontrada');
      return;
    }

    // Resetar votos
    console.log('Resetting votes for users:', room.users.map(u => ({ name: u.name, role: u.role, hasVoted: u.hasVoted })));
    room.users.forEach(user => {
      if (user.role === 'voter') {
        user.hasVoted = false;
        user.vote = undefined;
      }
    });
    room.votesRevealed = false;
    rooms.set(roomId, room);
    console.log('After reset:', room.users.map(u => ({ name: u.name, role: u.role, hasVoted: u.hasVoted })));

    // Notificar todos na sala
    io.to(roomId).emit('room-updated', room);
    
    console.log(`Votes reset in room ${roomId}`);
  });

  socket.on('disconnect', () => {
    const roomId = socket.data?.roomId;
    const userId = socket.data?.userId;
    
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

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Socket.io server running on port ${PORT}`);
});