import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000")
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
