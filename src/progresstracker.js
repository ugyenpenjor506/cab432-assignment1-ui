import React, { useEffect, useState } from 'react';
import socket from './socket'; // Import the socket instance
import { v4 as uuidv4 } from 'uuid'; // To generate a unique ID

const ProgressTracker = () => {
  const [progress, setProgress] = useState('Connecting...');
  const [taskId, setTaskId] = useState(null); // State to hold the generated task_id

  useEffect(() => {
    // Generate a unique task_id on the client side
    const newTaskId = uuidv4(); // Generate a new unique task ID
    setTaskId(newTaskId); // Store it in the state
  }, []);

  useEffect(() => {
    if (taskId) {
      // Listen for connection event
      socket.on('connect', () => {
        console.log('Connected to server');
        // Fetch progress using the generated task_id
        socket.emit('fetch_progress', { task_id: taskId });
      });

      // Listen for progress updates
      socket.on('progress_update', (data) => {
        setProgress(data.progress);
      });

      // Listen for disconnection
      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      // Cleanup on component unmount
      return () => {
        socket.off('connect');
        socket.off('progress_update');
        socket.off('disconnect');
      };
    }
  }, [taskId]); // Effect depends on taskId

  return (
    <div>
      <h2>Task Progress</h2>
      {taskId ? (
        <>
          <p>Task ID: {taskId}</p>
          <p>Progress: {progress}</p>
        </>
      ) : (
        <p>Generating task ID...</p>
      )}
    </div>
  );
};

export default ProgressTracker;
