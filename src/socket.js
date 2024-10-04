import { io } from 'socket.io-client';

const socket = io(`${process.env.REACT_APP_BASE_URL}`); // Replace with your Flask server address

export default socket;
