import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTaskAction, fetchTasks } from '../store/taskSlice';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { users, tasks } = useSelector((state) => state.tasks || { users: [], tasks: [] });
  const { user } = useSelector(state => state.auth || {});
  const [selectedUser, setSelectedUser] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'à faire' });
  const [editingTask, setEditingTask] = useState(null);
  const [editData, setEditData] = useState({});

  const handleCreateTask = () => {
    if (newTask.title && selectedUser) {
      dispatch(createTask({ ...newTask, assignedTo: selectedUser._id, createdBy: user.id }));
      setNewTask({ title: '', description: '', status: 'à faire' });
      dispatch(fetchTasks());
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task._id);
    setEditData({ title: task.title, description: task.description, status: task.status });
  };

  const handleSaveEdit = (taskId) => {
    dispatch(updateTaskAction({ taskId, taskData: editData }));
    setEditingTask(null);
    dispatch(fetchTasks());
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditData({});
  };

  const userTasks = selectedUser ? tasks.filter(task => task.assignedTo?._id?.toString() === selectedUser._id) : [];
  const createdTasks = userTasks.filter(task => task.createdBy?._id?.toString() === selectedUser._id);
  const assignedTasks = userTasks.filter(task => task.createdBy?._id?.toString() !== selectedUser._id);

  // Styles matching Dashboard
  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(30px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.4)',
    marginBottom: '20px'
  };

  const userCardStyle = {
    ...cardStyle,
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  };

  const usersGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
  };

  const secondaryButtonStyle = {
    padding: '12px 24px',
    background: 'rgba(100, 116, 139, 0.3)',
    color: 'white',
    border: '1px solid rgba(100, 116, 139, 0.5)',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const editButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    boxShadow: '0 8px 25px rgba(6, 182, 212, 0.3)'
  };

  const avatarStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    boxShadow: '0 8px 25px rgba(6, 182, 212, 0.3)'
  };

  const getStatusColor = (status) => ({
    'terminée': 'linear-gradient(135deg, #10b981, #059669)',
    'en cours': 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    'à faire': 'linear-gradient(135deg, #f59e0b, #d97706)'
  }[status] || 'linear-gradient(135deg, #6c757d, #4b5563)');

  return (
    <div style={cardStyle}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '30px'
      }}>
        ⚙️ Manage Users & Tasks
      </h2>
      <h3 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: 'white',
        marginBottom: '20px'
      }}>
        Users
      </h3>
      <div style={usersGridStyle}>
        {users
          .filter(user => user.role === 'user')
          .map(user => (
            <div
              key={user._id}
              style={{
                ...userCardStyle,
                background: selectedUser?._id === user._id ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)'
              }}
              onClick={() => setSelectedUser(user)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 24px 48px -12px rgba(0, 0, 0, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 20px 40px -12px rgba(0, 0, 0, 0.4)';
              }}
            >
              <div style={avatarStyle}>
                {(user.name || user.email).charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                  {user.email}
                </div>
              </div>
            </div>
          ))}
      </div>
      {selectedUser && (
        <div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '20px'
          }}>
            Tasks for {selectedUser.name} ({selectedUser.email})
          </h3>
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#cbd5e1',
              marginBottom: '15px'
            }}>
              Tasks Created by {selectedUser.name}
            </h4>
            {createdTasks.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>
                No tasks created by this user.
              </p>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {createdTasks.map(task => (
                  <div key={task._id} style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
                          {task.title}
                        </div>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '12px',
                          background: getStatusColor(task.status),
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600',
                          marginTop: '8px',
                          display: 'inline-block'
                        }}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#cbd5e1',
              marginBottom: '15px'
            }}>
              Tasks Assigned by You
            </h4>
            {assignedTasks.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>
                No tasks assigned by you.
              </p>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {assignedTasks.map(task => (
                  <div key={task._id} style={cardStyle}>
                    {editingTask === task._id ? (
                      <div>
                        <input
                          value={editData.title}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          placeholder="Task title"
                          style={inputStyle}
                        />
                        <textarea
                          value={editData.description}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          placeholder="Task description"
                          style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                        />
                        <select
                          value={editData.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                          style={inputStyle}
                        >
                          <option value="à faire">📝 À faire</option>
                          <option value="en cours">🔄 En cours</option>
                          <option value="terminée">✅ Terminée</option>
                        </select>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleSaveEdit(task._id)}
                            style={buttonStyle}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 12px 30px rgba(99, 102, 241, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            style={secondaryButtonStyle}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'rgba(100, 116, 139, 0.4)';
                              e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'rgba(100, 116, 139, 0.3)';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
                              {task.title}
                            </div>
                            <span style={{
                              padding: '6px 12px',
                              borderRadius: '12px',
                              background: getStatusColor(task.status),
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: '600',
                              marginTop: '8px',
                              display: 'inline-block'
                            }}>
                              {task.status}
                            </span>
                          </div>
                          <button
                            onClick={() => handleEdit(task)}
                            style={editButtonStyle}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 12px 30px rgba(6, 182, 212, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.3)';
                            }}
                          >
                            Edit
                          </button>
                        </div>
                        <p style={{ color: '#cbd5e1', margin: '10px 0', lineHeight: '1.6' }}>
                          {task.description || 'No description'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <h4 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#cbd5e1',
            marginBottom: '15px'
          }}>
            Add Task for {selectedUser.name}
          </h4>
          <input
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task title"
            required
            style={inputStyle}
          />
          <textarea
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Task description"
            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
          />
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            style={inputStyle}
          >
            <option value="à faire">📝 À faire</option>
            <option value="en cours">🔄 En cours</option>
            <option value="terminée">✅ Terminée</option>
          </select>
          <button
            onClick={handleCreateTask}
            style={buttonStyle}
            disabled={!newTask.title || !selectedUser}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 30px rgba(99, 102, 241, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
            }}
          >
            Add Task
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;