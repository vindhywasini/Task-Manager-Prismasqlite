'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
}

type ToastType = 'success' | 'error';

export default function Page() {
  const [token, setToken] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  function showToast(type: ToastType, message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2600);
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const t = window.localStorage.getItem('accessToken');
    if (t) {
      setToken(t);
      fetchTasks(1, t);
    }
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  async function fetchTasks(p = 1, overrideToken?: string) {
    const authToken = overrideToken ?? token;
    if (!authToken) return;

    try {
      setLoading(true);
      const res = await axios.get('http://localhost:4000/tasks', {
        headers: { Authorization: 'Bearer ' + authToken },
        params: { page: p, limit, search, status },
      });
      setTasks(res.data.items);
      setPage(res.data.page);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      showToast('error', 'Could not load tasks.');
    } finally {
      setLoading(false);
    }
  }

  async function toggle(id: number) {
    if (!token) return;
    try {
      await axios.post(
        `http://localhost:4000/tasks/${id}/toggle`,
        {},
        { headers: { Authorization: 'Bearer ' + token } }
      );
      showToast('success', 'Task updated.');
      fetchTasks(page);
    } catch (err) {
      console.error(err);
      showToast('error', 'Could not toggle task.');
    }
  }

  async function del(id: number) {
    if (!token) return;
    if (!confirm('Delete this task?')) return;
    try {
      await axios.delete(`http://localhost:4000/tasks/${id}`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      showToast('success', 'Task deleted.');
      fetchTasks(page);
    } catch (err) {
      console.error(err);
      showToast('error', 'Could not delete task.');
    }
  }

  async function handleLogout() {
    try {
      await axios.post(
        'http://localhost:4000/auth/logout',
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem('accessToken');
    setToken(null);
    setTasks([]);
    showToast('success', 'Logged out.');
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="dashboard-wrapper">
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}

      {!token ? (
        <div className="card logged-out-card" style={{ animation: 'slideInFromLeft 0.5s ease' }}>
          <h2 className="dashboard-title">Welcome to TrackToSuccess 🎯</h2>
          <p className="dashboard-subtitle">
            Create an account or log in to start managing your personal tasks.
          </p>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <a href="/login" className="btn-primary" style={{ textDecoration: 'none' }}>
              Log in
            </a>
            <a href="/register" className="btn-secondary" style={{ textDecoration: 'none' }}>
              Register
            </a>
          </div>
        </div>
      ) : (
        <>
          <div className="dashboard-header">
            <div>
              {/* 🔁 Changed from "Goal Tracking" to "Task Manager" */}
              <h2 className="dashboard-title">Task Manager</h2>
              <p className="dashboard-subtitle">
                Capture your tasks, mark them done, and stay consistent.
              </p>
            </div>

            <div className="filter-bar">
              <input
                className="input-field"
                placeholder="Search by title…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="filter-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

              <button className="btn-secondary" onClick={() => fetchTasks(1)}>
                Apply
              </button>
              <button
                className="btn-outline"
                onClick={() => {
                  setSearch('');
                  setStatus('');
                  fetchTasks(1);
                }}
              >
                Clear
              </button>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button className="btn-outline" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>

            <div className="summary-row">
              <div className="summary-pill">
                <span>Completed</span>
                <span className="count">{completedCount}</span>
              </div>
              <div className="summary-pill">
                <span>Pending</span>
                <span className="count">{pendingCount}</span>
              </div>
              <div className="summary-pill">
                <span>Total</span>
                <span className="count">{tasks.length}</span>
              </div>
            </div>
          </div>

          {/* Only one card now – the task manager */}
          <div className="dashboard-grid">
            <div
              className="card"
              style={{ animation: 'slideInFromLeft 0.6s ease' }}
            >
              <TaskForm
                token={token}
                onCreated={() => {
                  fetchTasks(1);
                  showToast('success', 'Task created!');
                }}
              />

              {loading && (
                <p className="empty-state">Loading your tasks…</p>
              )}

              {!loading && tasks.length === 0 && (
                <p className="empty-state">
                  No tasks yet. Add your first task above ✨
                </p>
              )}

              {!loading && tasks.length > 0 && (
                <>
                  <ul className="task-list">
                    {tasks.map((t) => (
                      <li className="task-card" key={t.id}>
                        <div className="task-title-row">
                          <span className="task-title">{t.title}</span>
                          <div className="task-actions">
                            <button
                              className="btn-icon neutral"
                              onClick={() => toggle(t.id)}
                            >
                              {t.completed ? 'Mark Pending' : 'Mark Done'}
                            </button>
                            <button
                              className="btn-icon danger"
                              onClick={() => del(t.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {t.description && (
                          <div className="task-description">
                            {t.description}
                          </div>
                        )}

                        <div className="task-meta-row">
                          <span className="task-meta-date">
                            Created:{' '}
                            {new Date(t.createdAt).toLocaleDateString()}
                          </span>
                          <span
                            className={
                              'status-pill ' +
                              (t.completed ? 'completed' : 'pending')
                            }
                          >
                            {t.completed ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="pagination">
                    <span>
                      Page {page} of {totalPages}
                    </span>
                    <div className="pagination-controls">
                      <button
                        className="btn-outline"
                        disabled={page <= 1}
                        onClick={() => fetchTasks(page - 1)}
                      >
                        Previous
                      </button>
                      <button
                        className="btn-outline"
                        disabled={page >= totalPages}
                        onClick={() => fetchTasks(page + 1)}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface TaskFormProps {
  token: string;
  onCreated: () => void;
}

function TaskForm({ token, onCreated }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setCreating(true);
      await axios.post(
        'http://localhost:4000/tasks',
        { title, description },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setTitle('');
      setDescription('');
      onCreated();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  }

  return (
    <form className="task-form" onSubmit={create}>
      <h3 style={{ margin: 0, fontSize: '1rem' }}>Add a new task</h3>
      <div className="task-form-row">
        <input
          className="input-field"
          placeholder="What do you want to accomplish?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="task-form-row">
        <input
          className="input-field"
          placeholder="Optional description…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button className="btn-primary" type="submit" disabled={creating}>
        {creating ? 'Adding…' : 'Add task'}
      </button>
    </form>
  );
}
