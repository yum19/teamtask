import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskAction, deleteTaskAction } from '../store/taskSlice';

const TaskList = ({ tasks = [], userId, role }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth || {});
  const [editingTask, setEditingTask] = useState(null);
  const [editData, setEditData] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('all');

  const handleStatusChange = (taskId, newStatus) => dispatch(updateTaskAction({ taskId, taskData: { status: newStatus } }));
  const handleDelete = (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    if (role === 'user' && task.createdBy?.toString() === userId && task.assignedTo?.toString() === userId) {
      if (window.confirm('Are you sure you want to delete this task?')) dispatch(deleteTaskAction(taskId));
    } else if (role === 'manager' && task.createdBy?.toString() !== user?.id) {
      if (window.confirm('Are you sure you want to delete this task?')) dispatch(deleteTaskAction(taskId));
    } else if (role === 'user' && task.assignedTo?.toString() === userId && task.createdBy?.toString() !== userId) {
      alert('You cannot delete a task assigned by a manager.');
    }
  };
  const handleEdit = (task) => {
    if ((role === 'user' && task.createdBy?.toString() === userId) || role === 'manager') {
      setEditingTask(task._id);
      setEditData({ title: task.title, description: task.description, status: task.status });
    } else {
      alert('You can only edit your own tasks.');
    }
  };
  const handleSaveEdit = (taskId) => {
    dispatch(updateTaskAction({ taskId, taskData: editData }));
    setEditingTask(null);
  };
  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditData({});
  };

  const getStatusColor = (status) => ({
    'terminée': 'linear-gradient(135deg, #10b981, #059669)',
    'en cours': 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    'à faire': 'linear-gradient(135deg, #f59e0b, #d97706)'
  }[status] || 'linear-gradient(135deg, #6c757d, #4b5563)');

  const getUserId = (userField) => {
    if (!userField) return null;
    if (typeof userField === 'object' && userField._id) return userField._id.toString();
    return userField.toString();
  };

  const filteredTasks = (Array.isArray(tasks) ? tasks : []).filter(task => {
    if (!task || !task._id) return false;
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;

    if (role === 'manager') {
      return true;
    } else if (role === 'user' && userId) {
      const createdByUserId = getUserId(task.createdBy);
      const assignedToUserId = getUserId(task.assignedTo);
      const userIdString = userId.toString();
      return createdByUserId === userIdString || assignedToUserId === userIdString;
    }
    return false;
  }).sort((a, b) => {
    if (sortBy === 'all') return 0;
    const aIsCreatedByUser = getUserId(a.createdBy) === userId.toString();
    const bIsCreatedByUser = getUserId(b.createdBy) === userId.toString();
    if (sortBy === 'created' && aIsCreatedByUser && !bIsCreatedByUser) return -1;
    if (sortBy === 'created' && !aIsCreatedByUser && bIsCreatedByUser) return 1;
    if (sortBy === 'assigned' && !aIsCreatedByUser && bIsCreatedByUser) return -1;
    if (sortBy === 'assigned' && aIsCreatedByUser && !bIsCreatedByUser) return 1;
    return 0;
  });

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

  const deleteButtonStyle = {
    padding: '12px 24px',
    background: 'rgba(220, 53, 69, 0.2)',
    color: 'white',
    border: '1px solid rgba(220, 53, 69, 0.3)',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  if (filteredTasks.length === 0) {
    return (
      <div style={cardStyle}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: 'white',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          No tasks found
        </h3>
        <p style={{
          color: '#cbd5e1',
          textAlign: 'center',
          fontSize: '16px'
        }}>
          {filterStatus === 'all' ? 'Create your first task or check with your manager for assignments!' : `No tasks found for status "${filterStatus}".`}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={inputStyle}
        >
          <option value="all">All Statuses</option>
          <option value="à faire">📝 À faire</option>
          <option value="en cours">🔄 En cours</option>
          <option value="terminée">✅ Terminée</option>
        </select>
        {role === 'user' && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={inputStyle}
          >
            <option value="all">All Tasks</option>
            <option value="created">Created by Me</option>
            <option value="assigned">Assigned to Me</option>
          </select>
        )}
      </div>
      <div style={{ display: 'grid', gap: '20px' }}>
        {filteredTasks.map((task) => (
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      margin: '0 0 8px 0'
                    }}>
                      {task.title}
                    </h3>
                    {role === 'user' && (
                      <small style={{
                        color: getUserId(task.createdBy) === userId.toString() ? '#10b981' : '#f59e0b',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {getUserId(task.createdBy) === userId.toString() ? 'Created by You' : 'Assigned by Manager'}
                      </small>
                    )}
                  </div>
                  <span style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    background: getStatusColor(task.status),
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {task.status}
                  </span>
                </div>
                <p style={{ margin: '10px 0', color: '#cbd5e1', lineHeight: '1.6' }}>
                  {task.description || 'No description'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                    Assigned to: {task.assignedTo && task.assignedTo.name ? `${task.assignedTo.name} (${task.assignedTo.email})` : 'Unassigned'}
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {task.status !== 'terminée' && (
                      <button
                        onClick={() => handleStatusChange(task._id, 'terminée')}
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
                        Complete
                      </button>
                    )}
                    {(role === 'manager' || (role === 'user' && getUserId(task.createdBy) === userId.toString())) && (
                      <button
                        onClick={() => handleEdit(task)}
                        style={{ ...buttonStyle, background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
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
                    )}
                    {(role === 'manager' && getUserId(task.createdBy) !== user?.id.toString()) || (role === 'user' && getUserId(task.createdBy) === userId.toString() && getUserId(task.assignedTo) === userId.toString()) ? (
                      <button
                        onClick={() => handleDelete(task._id)}
                        style={deleteButtonStyle}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(220, 53, 69, 0.3)';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(220, 53, 69, 0.2)';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;