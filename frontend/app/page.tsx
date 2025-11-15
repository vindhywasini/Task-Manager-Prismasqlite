'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Page(){
  const [token, setToken] = useState('');
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(()=> {
    const t = localStorage.getItem('accessToken') || '';
    setToken(t);
    if(t) fetchTasks();
  }, []);

  async function fetchTasks(p = 1){
    try{
      const res = await axios.get('http://localhost:4000/tasks', {
        headers: { Authorization: 'Bearer ' + (localStorage.getItem('accessToken')||'') },
        params: { page: p, limit: 10, search, status }
      });
      setTasks(res.data.items);
      setPage(res.data.page);
    }catch(e){
      console.error(e);
      // Could try refresh flow here
    }
  }

  async function toggle(id:number){
    await axios.post(`http://localhost:4000/tasks/${id}/toggle`, {}, { headers: { Authorization: 'Bearer ' + token } });
    fetchTasks(page);
  }

  async function del(id:number){
    await axios.delete(`http://localhost:4000/tasks/${id}`, { headers: { Authorization: 'Bearer ' + token } });
    fetchTasks(page);
  }

  return (
    <div>
      {!token && <div>
        <p>Please <a href="/login">Login</a> or <a href="/register">Register</a></p>
      </div>}
      {token && <>
        <div style={{ marginBottom: 12 }}>
          <input placeholder="Search title" value={search} onChange={e=>setSearch(e.target.value)} />
          <select value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={()=>fetchTasks(1)}>Search</button>
          <button onClick={()=>{ localStorage.removeItem('accessToken'); setToken(''); }}>Logout</button>
        </div>

        <TaskForm onCreated={()=>fetchTasks(1)} token={token}/>
        <ul>
          {tasks.map((t:any)=>(
            <li key={t.id}>
              <strong>{t.title}</strong> - {t.description || '—'} — {t.completed ? '✅' : '❌'}
              <button onClick={()=>toggle(t.id)}>Toggle</button>
              <button onClick={()=>del(t.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </>}
    </div>
  )
}

function TaskForm({ onCreated, token }: any){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  async function create(){
    await axios.post('http://localhost:4000/tasks', { title, description }, { headers: { Authorization: 'Bearer ' + token }});
    setTitle(''); setDescription('');
    onCreated();
  }
  return <div style={{ marginBottom: 12 }}>
    <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
    <input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
    <button onClick={create}>Create</button>
  </div>
}
