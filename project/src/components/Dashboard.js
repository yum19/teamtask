import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, createTask } from '../store/taskSlice';
import { logout, validateToken } from '../store/authSlice';
import TaskList from './TaskList';
import AdminPanel from './AdminPanel';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isLoading, error } = useSelector((state) => state.auth || { user: null, token: null, isLoading: true, error: null });
  const { tasks, status: taskStatus, error: taskError } = useSelector((state) => state.tasks || { tasks: [], status: 'idle', error: null });
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'à faire' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Validate token and get user data on mount
  useEffect(() => {
    if (token && !user) {
      console.log('Token found but no user data, validating token...');
      dispatch(validateToken());
    } else if (!token) {
      console.log('No token found, redirecting to login...');
      navigate('/login');
    }
  }, [dispatch, token, user, navigate]);

  // Fetch tasks when auth is ready and valid
  useEffect(() => {
    if (!isLoading && token && user) {
      console.log('Auth ready, fetching tasks with token:', token, 'User:', user);
      dispatch(fetchTasks()).then((result) => {
        console.log('Fetch tasks result:', result.payload);
      }).catch((error) => {
        console.error('Fetch tasks error:', error);
      });
    } else if (!isLoading && !user && !token) {
      console.log('No valid authentication, redirecting to login...');
      navigate('/login');
    }
  }, [dispatch, isLoading, token, user, navigate]);

  // Handle auth errors (invalid token, etc.)
  useEffect(() => {
    if (!isLoading && error && !user) {
      console.log('Authentication error, redirecting to login:', error);
      navigate('/login');
    }
  }, [isLoading, error, user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCreateTask = async () => {
    if (newTask.title && user) {
      console.log('Creating task with data:', { ...newTask, assignedTo: user.id, createdBy: user.id });
      console.log('User data:', user);
      
      try {
        const createResult = await dispatch(createTask({ ...newTask, assignedTo: user.id, createdBy: user.id }));
        console.log('Create task result:', createResult);
        
        setNewTask({ title: '', description: '', status: 'à faire' });
        setShowCreateForm(false);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Refreshing tasks after creation...');
        const fetchResult = await dispatch(fetchTasks());
        console.log('Fetch after create result:', fetchResult.payload);
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }
  };

  const getUserId = (userField) => {
    if (!userField) return null;
    if (typeof userField === 'object' && userField._id) return userField._id.toString();
    return userField.toString();
  };

  const getUserTaskCount = () => {
    if (!user || !Array.isArray(tasks)) return 0;
    return tasks.filter(task => {
      const createdByUserId = getUserId(task.createdBy);
      const assignedToUserId = getUserId(task.assignedTo);
      const userIdString = user.id.toString();
      return createdByUserId === userIdString || assignedToUserId === userIdString;
    }).length;
  };

  const getTaskStats = () => {
    if (!Array.isArray(tasks)) return { todo: 0, inProgress: 0, completed: 0 };
    const userTasks = user.role === 'manager' ? tasks : tasks.filter(task => {
      const createdByUserId = getUserId(task.createdBy);
      const assignedToUserId = getUserId(task.assignedTo);
      const userIdString = user.id.toString();
      return createdByUserId === userIdString || assignedToUserId === userIdString;
    });

    return {
      todo: userTasks.filter(task => task.status === 'à faire').length,
      inProgress: userTasks.filter(task => task.status === 'en cours').length,
      completed: userTasks.filter(task => task.status === 'terminée').length
    };
  };

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #581c87 50%, #be185d 75%, #0f172a 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  };

  const backgroundOrbStyle = {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: '0.1',
    animation: 'float 8s ease-in-out infinite'
  };

  const headerStyle = {
    position: 'relative',
    zIndex: 10,
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(30px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '20px 0'
  };

  const headerContentStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const logoIconStyle = {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
  };

  const logoTextStyle = {
    fontSize: '24px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
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

  const userDetailsStyle = {
    color: 'white'
  };

  const logoutButtonStyle = {
    padding: '12px 24px',
    background: 'rgba(220, 53, 69, 0.2)',
    color: 'white',
    border: '1px solid rgba(220, 53, 69, 0.3)',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  };

  const mainContentStyle = {
    position: 'relative',
    zIndex: 10,
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 20px'
  };

  const tabsStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '30px',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '8px',
    borderRadius: '16px',
    backdropFilter: 'blur(30px)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const tabStyle = {
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    background: 'transparent',
    color: '#94a3b8',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const activeTabStyle = {
    ...tabStyle,
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(30px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.4)',
    marginBottom: '20px'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const statCardStyle = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(30px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.4)',
    position: 'relative',
    overflow: 'hidden'
  };

  const statIconStyle = {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    marginBottom: '20px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
  };

  const statNumberStyle = {
    fontSize: '36px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px'
  };

  const statLabelStyle = {
    color: '#cbd5e1',
    fontSize: '16px',
    fontWeight: '500'
  };

  const createButtonStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 12px 30px rgba(99, 102, 241, 0.4)',
    transition: 'all 0.3s ease',
    zIndex: 1000
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(10px)'
  };

  const modalStyle = {
    width: '90%',
    maxWidth: '500px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(30px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6)'
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
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginRight: '12px'
  };

  const secondaryButtonStyle = {
    padding: '16px 24px',
    background: 'rgba(100, 116, 139, 0.3)',
    color: 'white',
    border: '1px solid rgba(100, 116, 139, 0.5)',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  // Show loading while validating authentication
  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={{...backgroundOrbStyle, top: '-200px', right: '-200px', width: '400px', height: '400px', background: '#6366f1'}}></div>
        <div style={{...backgroundOrbStyle, bottom: '-200px', left: '-200px', width: '350px', height: '350px', background: '#8b5cf6'}}></div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2 style={{fontSize: '24px', fontWeight: '600', marginBottom: '10px'}}>Loading Dashboard</h2>
          <p style={{color: '#cbd5e1'}}>Validating your session...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              33% { transform: translateY(-20px) rotate(1deg); }
              66% { transform: translateY(-10px) rotate(-1deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Show error if authentication failed
  if (error && !user) {
    return (
      <div style={containerStyle}>
        <div style={{...backgroundOrbStyle, top: '-200px', right: '-200px', width: '400px', height: '400px', background: '#dc3545'}}></div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white',
          ...cardStyle,
          maxWidth: '400px'
        }}>
          <div style={{fontSize: '48px', marginBottom: '20px'}}>🚫</div>
          <h2 style={{fontSize: '24px', fontWeight: '600', marginBottom: '10px'}}>Authentication Failed</h2>
          <p style={{color: '#cbd5e1', marginBottom: '30px'}}>{error}</p>
          <button 
            onClick={() => navigate('/login')}
            style={buttonStyle}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Don't render if no user data
  if (!user) {
    return (
      <div style={containerStyle}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white'
        }}>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const stats = getTaskStats();

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(1deg); }
            66% { transform: translateY(-10px) rotate(-1deg); }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .floating-particles {
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            animation: float 4s ease-in-out infinite;
          }
        `}
      </style>

      {/* Animated background elements */}
      <div style={{...backgroundOrbStyle, top: '-200px', right: '-200px', width: '400px', height: '400px', background: '#6366f1', animationDelay: '0s'}}></div>
      <div style={{...backgroundOrbStyle, bottom: '-200px', left: '-200px', width: '350px', height: '350px', background: '#8b5cf6', animationDelay: '2s'}}></div>
      <div style={{...backgroundOrbStyle, top: '20%', left: '10%', width: '200px', height: '200px', background: '#06b6d4', animationDelay: '4s'}}></div>
      <div style={{...backgroundOrbStyle, bottom: '20%', right: '10%', width: '150px', height: '150px', background: '#be185d', animationDelay: '1s'}}></div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="floating-particles"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}

      {/* Header */}
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          <div style={logoStyle}>
            <div style={logoIconStyle}>
              <span>{user.role === 'manager' ? '👑' : '✨'}</span>
            </div>
            <div style={logoTextStyle}>TeamTask</div>
          </div>
          
          <div style={userInfoStyle}>
            <div style={userDetailsStyle}>
              <div style={{fontWeight: '600', fontSize: '18px'}}>
                Welcome, {user.name || user.email}!
              </div>
              <div style={{color: '#cbd5e1', fontSize: '14px'}}>
                {user.role === 'manager' ? '👑 Manager' : '⭐ User'} • {user.role === 'manager' ? tasks.length : getUserTaskCount()} tasks
              </div>
            </div>
            <div style={avatarStyle}>
              {(user.name || user.email).charAt(0).toUpperCase()}
            </div>
            <button 
              onClick={handleLogout}
              style={logoutButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(220, 53, 69, 0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(220, 53, 69, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        {/* Navigation Tabs */}
        <div style={tabsStyle}>
          <button
            style={activeTab === 'overview' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            style={activeTab === 'tasks' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('tasks')}
          >
            📋 Tasks
          </button>
          {user.role === 'manager' && (
            <button
              style={activeTab === 'admin' ? activeTabStyle : tabStyle}
              onClick={() => setActiveTab('admin')}
            >
              ⚙️ Admin Panel
            </button>
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div style={statsGridStyle}>
              <div style={statCardStyle}>
                <div style={{...statIconStyle, background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
                  📝
                </div>
                <div style={statNumberStyle}>{stats.todo}</div>
                <div style={statLabelStyle}>To Do</div>
              </div>
              
              <div style={statCardStyle}>
                <div style={{...statIconStyle, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'}}>
                  🔄
                </div>
                <div style={statNumberStyle}>{stats.inProgress}</div>
                <div style={statLabelStyle}>In Progress</div>
              </div>
              
              <div style={statCardStyle}>
                <div style={{...statIconStyle, background: 'linear-gradient(135deg, #10b981, #059669)'}}>
                  ✅
                </div>
                <div style={statNumberStyle}>{stats.completed}</div>
                <div style={statLabelStyle}>Completed</div>
              </div>
            </div>

            {/* Quick Overview */}
            <div style={cardStyle}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                🎯 Quick Overview
              </h3>
              <div style={{color: '#cbd5e1', lineHeight: '1.6'}}>
                {user.role === 'manager' ? (
                  <p>You're managing <strong style={{color: 'white'}}>{tasks.length} total tasks</strong> across your team. 
                  Keep track of progress and ensure deadlines are met.</p>
                ) : (
                  <p>You have <strong style={{color: 'white'}}>{getUserTaskCount()} tasks</strong> assigned to you. 
                  Stay organized and complete your work efficiently.</p>
                )}
              </div>
            </div>
          </>
        )}

        {taskStatus === 'loading' && activeTab === 'tasks' && (
          <div style={{...cardStyle, textAlign: 'center', padding: '60px'}}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <div style={{color: 'white', fontSize: '18px'}}>Loading tasks...</div>
          </div>
        )}

        {taskStatus === 'failed' && activeTab === 'tasks' && (
          <div style={{...cardStyle, textAlign: 'center'}}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>❌</div>
            <h3 style={{color: 'white', marginBottom: '10px'}}>Error Loading Tasks</h3>
            <p style={{color: '#cbd5e1', marginBottom: '30px'}}>{taskError || 'Failed to load tasks.'}</p>
            <button 
              onClick={() => dispatch(fetchTasks())} 
              style={buttonStyle}
            >
              Retry
            </button>
          </div>
        )}

        {taskStatus === 'succeeded' && activeTab === 'tasks' && (
          <div style={cardStyle}>
            <TaskList tasks={tasks} userId={user.id} role={user.role} />
          </div>
        )}

        {activeTab === 'admin' && user.role === 'manager' && (
          <div style={cardStyle}>
            <AdminPanel />
          </div>
        )}
      </div>

      {/* Floating Create Button (only for users) */}
      {user.role === 'user' && (
        <button
          style={createButtonStyle}
          onClick={() => setShowCreateForm(true)}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 16px 40px rgba(99, 102, 241, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 12px 30px rgba(99, 102, 241, 0.4)';
          }}
        >
          +
        </button>
      )}

      {/* Create Task Modal */}
      {showCreateForm && (
        <div style={modalOverlayStyle} onClick={() => setShowCreateForm(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'white',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              ✨ Create New Task
            </h3>
            
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
              style={{...inputStyle, minHeight: '100px', resize: 'vertical'}}
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
            
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '20px'}}>
              <button
                onClick={() => setShowCreateForm(false)}
                style={secondaryButtonStyle}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                style={buttonStyle}
                disabled={!newTask.title}
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;