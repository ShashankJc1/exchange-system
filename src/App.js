import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [view, setView] = useState('register'); // register, login, offers, postOffer
  const [formData, setFormData] = useState({});
  const [offers, setOffers] = useState([]);
  const [userId, setUserId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (view === 'register') {
        response = await axios.post('http://localhost:5000/register', formData);
      } else if (view === 'login') {
        response = await axios.post('http://localhost:5000/login', formData);
        setUserId(response.data.user_id);
      } else if (view === 'postOffer') {
        response = await axios.post('http://localhost:5000/post_offer', { ...formData, user_id: userId });
      }
      alert(response.data.message);
      if (view === 'login') setView('offers');
    } catch (err) {
      alert(err.response.data.message || 'An error occurred');
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/offers');
      setOffers(response.data);
    } catch (err) {
      alert('Failed to fetch offers');
    }
  };

  useEffect(() => {
    if (view === 'offers') fetchOffers();
  }, [view]);

  return (
    <div>
      <h1>Online Exchange System</h1>
      {view === 'register' && (
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
          <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          <button type="submit">Register</button>
          <button onClick={() => setView('login')}>Go to Login</button>
        </form>
      )}
      {view === 'login' && (
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          <button type="submit">Login</button>
        </form>
      )}
      {view === 'postOffer' && (
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Item Name" onChange={(e) => setFormData({ ...formData, item_name: e.target.value })} required />
          <textarea placeholder="Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
          <button type="submit">Post Offer</button>
          <button onClick={() => setView('offers')}>View Offers</button>
        </form>
      )}
      {view === 'offers' && (
        <div>
          <button onClick={() => setView('postOffer')}>Post an Offer</button>
          <ul>
            {offers.map((offer) => (
              <li key={offer.id}>
                <h2>{offer.item_name}</h2>
                <p>{offer.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
