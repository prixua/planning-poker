const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

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

// Função para buscar ou criar sala
const getOrCreateRoom = (roomId) => {
  return rooms.get(roomId) || createRoom(roomId);
};

// Função para remover usuário de uma sala
const removeUserFromRoom = (socketId) => {
  for (const [roomId, room] of rooms.entries()) {
    const userIndex = room.users.findIndex(user => user.socketId === socketId);
    if (userIndex !== -1) {
      room.users.splice(userIndex, 1);
      
      // Se a sala ficar vazia, remove ela
      if (room.users.length === 0) {
        rooms.delete(roomId);
      }
      
      return { roomId, room };
    }
  }
  return null;
};

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Configurar Socket.io
  const io = new Server(server, {
    path: '/api/socket',
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 Usuário conectado:', socket.id);

    // Entrar em uma sala
    socket.on('join-room', (data) => {
      console.log('👥 Usuário entrando na sala:', data);
      
      const { roomId, userName, role } = data;
      const room = getOrCreateRoom(roomId);
      
      // Verificar se usuário já existe na sala (reconexão)
      let existingUser = room.users.find(user => user.name === userName);
      
      if (existingUser) {
        // Atualizar socket ID do usuário existente
        existingUser.socketId = socket.id;
        existingUser.connected = true;
      } else {
        // Adicionar novo usuário
        const newUser = {
          id: generateUserId(),
          socketId: socket.id,
          name: userName,
          role: role || 'voter',
          vote: null,
          connected: true
        };
        room.users.push(newUser);
      }
      
      // Entrar na sala do Socket.io
      socket.join(roomId);
      
      // Enviar estado da sala atualizado para todos na sala
      io.to(roomId).emit('room-updated', room);
      
      console.log(`✅ Usuário ${userName} entrou na sala ${roomId}. Total: ${room.users.length} usuários`);
    });

    // Votar
    socket.on('vote', (data) => {
      console.log('🗳️ Voto recebido:', data);
      
      const { roomId, vote } = data;
      const room = rooms.get(roomId);
      
      if (room) {
        const user = room.users.find(user => user.socketId === socket.id);
        if (user) {
          user.vote = vote;
          
          // Enviar estado da sala atualizado
          io.to(roomId).emit('room-updated', room);
          
          console.log(`✅ Voto de ${user.name}: ${vote}`);
        }
      }
    });

    // Revelar votos
    socket.on('reveal-votes', (data) => {
      const roomId = data?.roomId;
      console.log('👁️ Revelando votos na sala:', roomId);
      
      if (!roomId) {
        console.error('❌ roomId não fornecido para reveal-votes');
        return;
      }
      
      const room = rooms.get(roomId);
      if (room) {
        room.votesRevealed = true;
        console.log('📡 Enviando room-updated para sala:', roomId, 'Usuários:', room.users.length);
        io.to(roomId).emit('room-updated', room);
        
        console.log('✅ Votos revelados na sala', roomId);
      }
    });

    // Resetar votos
    socket.on('reset-votes', (data) => {
      const roomId = data?.roomId;
      console.log('🔄 Resetando votos na sala:', roomId);
      
      if (!roomId) {
        console.error('❌ roomId não fornecido para reset-votes');
        return;
      }
      
      const room = rooms.get(roomId);
      if (room) {
        // Limpar todos os votos
        room.users.forEach(user => {
          user.vote = null;
        });
        room.votesRevealed = false;
        
        io.to(roomId).emit('room-updated', room);
        
        console.log('✅ Votos resetados na sala', roomId);
      }
    });

    // Desconexão
    socket.on('disconnect', () => {
      console.log('🔌 Usuário desconectado:', socket.id);
      
      const result = removeUserFromRoom(socket.id);
      if (result) {
        const { roomId, room } = result;
        
        // Notificar outros usuários da sala
        io.to(roomId).emit('room-updated', room);
        
        console.log(`👋 Usuário removido da sala ${roomId}. Usuários restantes: ${room.users.length}`);
      }
    });
  });

  server.listen(port, hostname, () => {
    console.log(`🚀 Planning Poker rodando em http://${hostname}:${port}`);
    console.log(`🔌 Socket.io integrado no path /api/socket`);
  });
});