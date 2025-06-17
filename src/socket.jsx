import io from "socket.io-client" 
const URL = "https://server.zaroo.co" 

export const socket = io(URL);
