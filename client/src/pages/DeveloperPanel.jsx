import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DeveloperPanel() {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const config = { headers: { 'x-auth-token': token } };

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'services') {
        const res = await axios.get('/api/services');
        setServices(res.data);
      } else {
        const res = await axios.get('/api/users', config);
        setUsers(res.data);
      }
    } catch (err) { if(err.response && err.response.status === 401) navigate('/login'); }
  };

  const handleDeleteService = async (id) => {
    if (confirm('Delete this service?')) {
      await axios.delete(`/api/services/${id}`, config);
      fetchData();
    }
  };

  const handleDeleteUser = async (id) => {
    if (confirm('Ban this user?')) {
      await axios.delete(`/api/users/${id}`, config);
      fetchData();
    }
  };

  const startEdit = (service) => { setEditingId(service._id); setEditForm(service); };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };
  const saveEdit = async () => {
    try {
      await axios.put(`/api/services/${editingId}`, editForm, config);
      setEditingId(null);
      fetchData();
    } catch (err) { alert('Update failed'); }
  };

  const filteredServices = services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 font-sans p-6 md:p-10">
      <div className="flex justify-between items-center mb-10 border-b border-gray-700 pb-6">
        <h1 className="text-4xl font-extrabold text-blue-500">Developer Console 👨‍💻</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/')} className="px-5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700">View Site</button>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700">Logout</button>
        </div>
      </div>

      <div className="flex mb-8 gap-4">
        <button onClick={() => setActiveTab('services')} className={`px-6 py-2 rounded-lg font-bold ${activeTab === 'services' ? 'bg-blue-600' : 'bg-gray-800'}`}>Services</button>
        <button onClick={() => setActiveTab('users')} className={`px-6 py-2 rounded-lg font-bold ${activeTab === 'users' ? 'bg-purple-600' : 'bg-gray-800'}`}>Users</button>
        <input placeholder="Search..." className="ml-auto bg-gray-800 border border-gray-700 p-2 rounded w-64 text-white" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {activeTab === 'services' && (
        <div className="grid gap-4">
          {filteredServices.map(s => (
            <div key={s._id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
              {editingId === s._id ? (
                <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-3">
                  <input className="bg-gray-900 border border-gray-600 p-2 rounded text-white" value={editForm.name} onChange={e=>setEditForm({...editForm, name: e.target.value})} />
                  <input className="bg-gray-900 border border-gray-600 p-2 rounded text-white" value={editForm.contact} onChange={e=>setEditForm({...editForm, contact: e.target.value})} />
                  <input className="bg-gray-900 border border-gray-600 p-2 rounded text-white" value={editForm.category} onChange={e=>setEditForm({...editForm, category: e.target.value})} />
                  
                  {/* PRICE EDIT FIELD */}
                  <input type="number" className="bg-gray-900 border border-gray-600 p-2 rounded text-white" placeholder="Price" value={editForm.price} onChange={e=>setEditForm({...editForm, price: Number(e.target.value)})} />
                  
                  <input className="bg-gray-900 border border-gray-600 p-2 rounded text-white" value={editForm.location?.address} onChange={e=>setEditForm({...editForm, location: {...editForm.location, address: e.target.value}})} />
                </div>
              ) : (
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{s.name}</h3>
                  <p className="text-gray-400 text-sm">{s.category} • 📞 {s.contact}</p>
                  <p className="text-green-400 font-bold text-sm">Price: ₹{s.price || 99}</p>
                </div>
              )}

              <div className="flex gap-2">
                {editingId === s._id ? (
                  <>
                    <button onClick={saveEdit} className="bg-green-600 px-4 py-2 rounded font-bold">Save</button>
                    <button onClick={cancelEdit} className="bg-gray-600 px-4 py-2 rounded font-bold">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(s)} className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded font-bold">Edit</button>
                    <button onClick={() => handleDeleteService(s._id)} className="bg-red-600/20 text-red-400 px-4 py-2 rounded font-bold">Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
           {filteredUsers.map(u => (
             <div key={u._id} className="flex justify-between border-b border-gray-700 py-3">
               <div><p className="font-bold">{u.name}</p><p className="text-sm text-gray-400">{u.email}</p></div>
               {u.role !== 'developer' && <button onClick={() => handleDeleteUser(u._id)} className="bg-red-500 text-white px-3 py-1 rounded">Ban</button>}
             </div>
           ))}
        </div>
      )}
    </div>
  );
}