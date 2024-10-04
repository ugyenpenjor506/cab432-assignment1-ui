import { io } from 'socket.io-client';

const socket = io('http://localhost:5005'); // Replace with your Flask server address

export default socket;
