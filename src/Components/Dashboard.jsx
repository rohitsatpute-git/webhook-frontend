import React, { useState, useEffect, useCallback } from 'react';
import WebhookLogs from './WebhookLogs';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [source, setSource] = useState('');
  const [callbackUrl, setCallbackUrl] = useState('');
  const [webhooks, setWebhooks] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${VITE_BACKEND_URL}/webhooks/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ source, callbackUrl }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Subscribed successfully!');
        fetchWebhooks();
        setSource('');
        setCallbackUrl('');
      } else {
        alert(data.msg || 'Subscription failed');
      }
    } catch (err) {
      alert('Network error');
      console.error(err);
    }
  };

  const fetchWebhooks = async () => {
    const res = await fetch(`${VITE_BACKEND_URL}/webhooks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if(res.status === 401) {
        navigate('/auth')
    }
    const data = await res.json();
    setWebhooks(data);
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const handleUnsubscribe = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/webhooks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if(res.status === 200) {
        setWebhooks(prev => prev.filter(webhoob => webhoob._id !== id))
      }
      // Refresh or update list after deletion
    } catch (err) {
      console.error('Error unsubscribing:', err);
    }
  };

  const onLogoutCliked = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/auth')
  }, [])

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6 relaitve">
      <button className='absolute top-2 right-2 cursor-pointer px-4 py-2 rounded-md border ' onClick={onLogoutCliked}>Logout</button>
      <h2 className="text-2xl font-bold">Subscribe to a Webhook</h2>

      <form onSubmit={handleSubscribe} className="space-y-4">
      <select value={source} onChange={(e) => setSource(e.target.value)} required className="w-full px-3 py-2 border rounded">
        <option value="">Select Service Provider</option>
        <option value="github">GitHub</option>
        <option value="stripe">Stripe</option>
        <option value="slack">Slack</option>
        <option value="notion">Notion</option>
      </select>  
      <input type="url" placeholder="Callback URL" value={callbackUrl} onChange={(e) => setCallbackUrl(e.target.value)} required className="w-full px-3 py-2 border rounded"/>
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded cursor-pointer">
            Subscribe
        </button>
      </form>

      <hr />

      <div className='flex flex-col gap-y-4  border rounded p-4'>
        <h3 className="text-xl font-semibold ">Subscribed Webhooks</h3>
        <ul className="space-y-2">
            {webhooks.map((webhook, index) => (
                <div className='flex flex-row justify-between' key={webhook._id}>
                    <li  className=" ">
                        <span>{index + 1}.</span><strong>{webhook.source}</strong> → {webhook.callbackUrl}
                    </li>
                    <button onClick={() => handleUnsubscribe(webhook._id)} className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer">
                        Unsubscribe
                    </button>
            </div>
            ))}
        </ul>
      </div>
      <WebhookLogs />

    </div>
  );
};

export default Dashboard;
