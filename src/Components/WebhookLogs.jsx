import { useEffect, useState } from 'react';
import { connect, io } from 'socket.io-client';

const socket = io(import.meta.env.VITWgo_URL, {
    transports: ['websocket']
}); 

const WebhookLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on('webhook_event', (event) => {
        console.log("received io event", event)
      setLogs((prev) => [event, ...prev]);
    });

    return () => {
      socket.off('webhook_event');
    };
  }, []);

  return (
    <div className="p-4 border mt-4 bg-white rounded shadow max-h-96 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">Real-time Webhook Events</h2>
      {logs.map((log, idx) => (
        <div key={idx} className="border-b py-2 text-sm">
          <strong>{log.source}</strong>: {JSON.stringify(log.data)}
          <div className="text-gray-500 text-xs">{new Date(log.timestamp).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};

export default WebhookLogs;
