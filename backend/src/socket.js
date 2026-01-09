// Socket.io helper: actions for reservation updates and rooms
function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('join_reservation_room', (reservationId) => {
      socket.join(`reservation:${reservationId}`);
    });

    socket.on('leave_reservation_room', (reservationId) => {
      socket.leave(`reservation:${reservationId}`);
    });

    // Example: when client emits reservation_updated with reservation payload,
    // server broadcasts to other clients in that room
    socket.on('reservation_updated', (payload) => {
      const { id } = payload || {};
      if (!id) return;
      socket.to(`reservation:${id}`).emit('reservation_updated', payload);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id);
    });
  });
}

module.exports = setupSocket;
