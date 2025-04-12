import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ type = "signin" }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const isSignup = type === 'signup
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? '/auth/signup' : '/auth/signin';

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.status === 200 || res.status == 201) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard')
      } else {
        alert(data.msg || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const onPageChage = useCallback(() => {
    setIsSignup(prev => !prev);
  }, [])

  return (
    <div className='flex flex-col w-screen h-screen fixed inset-0 top-[30%] items-center'>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-6 bg-white shadow rounded space-y-4  ">
          <h2 className="text-xl font-bold text-center">
          {isSignup ? 'Sign Up' : 'Sign In'}
          </h2>
          <input type="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" />
          <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" />
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
          {isSignup ? 'Sign Up' : 'Sign In'}
          </button>

          <div className='mx-auto w-full text-center underline text-blue-500 cursor-pointer select-none' onClick={onPageChage}>{!isSignup ? 'Sign Up' : 'Sign In'}</div>
      </form>
    </div>
  );
};

export default AuthForm;
