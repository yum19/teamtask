import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { user, token } = response.data;
      dispatch(setCredentials({ user, token }));
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      alert('Login failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => navigate('/register');

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #581c87 50%, #be185d 75%, #0f172a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const backgroundOrbStyle = {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: '0.15',
    animation: 'float 6s ease-in-out infinite'
  };

  const cardStyle = {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(30px)',
    borderRadius: '28px',
    padding: '40px',
    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6), 0 0 0 0px rgba(255, 255, 255, 0)', // Removed border, adjusted boxShadow
  };

  const logoStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '72px',
    height: '72px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
    borderRadius: '20px',
    marginBottom: '20px',
    boxShadow: '0 15px 35px rgba(99, 102, 241, 0.4)',
    fontSize: '28px',
    animation: 'glow 2s ease-in-out infinite alternate'
  };

  const titleStyle = {
    fontSize: '36px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px',
    textAlign: 'center',
    letterSpacing: '-0.02em'
  };

  const subtitleStyle = {
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: '40px',
    fontSize: '16px',
    fontWeight: '400'
  };

  const inputContainerStyle = {
    position: 'relative',
    marginBottom: '28px'
  };

  const inputStyle = {
    width: '100%',
    paddingLeft: '56px',
    paddingRight: '16px',
    paddingTop: '18px',
    paddingBottom: '18px',
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '16px',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    boxSizing: 'border-box'
  };

  const inputFocusStyle = {
    borderColor: 'transparent',
    background: 'rgba(15, 23, 42, 0.8)',
    boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.3), 0 8px 25px rgba(99, 102, 241, 0.15)',
    transform: 'translateY(-2px)'
  };

  const iconStyle = {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '20px',
    transition: 'all 0.3s ease',
    zIndex: 2
  };

  const buttonStyle = {
    width: '100%',
    padding: '18px 24px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
    backgroundSize: '200% 200%',
    color: 'white',
    fontWeight: '700',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translateY(0)',
    boxShadow: '0 12px 30px rgba(99, 102, 241, 0.4)',
    marginBottom: '20px',
    position: 'relative',
    overflow: 'hidden',
    animation: 'gradientShift 3s ease infinite'
  };

  const buttonHoverStyle = {
    transform: 'translateY(-3px)',
    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.5)',
    backgroundPosition: '100% 0'
  };

  const secondaryButtonStyle = {
    width: '100%',
    padding: '16px 24px',
    background: 'rgba(30, 41, 59, 0.4)',
    color: 'white',
    fontWeight: '600',
    border: '1px solid rgba(100, 116, 139, 0.3)',
    borderRadius: '16px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    overflow: 'hidden'
  };

  const eyeButtonStyle = {
    position: 'absolute',
    right: '18px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'all 0.2s ease',
    zIndex: 2,
    padding: '4px'
  };

  const dividerStyle = {
    position: 'relative',
    margin: '32px 0',
    textAlign: 'center'
  };

  const dividerLineStyle = {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.3), transparent)'
  };

  const dividerTextStyle = {
    background: 'rgba(15, 23, 42, 0.8)',
    padding: '0 20px',
    color: '#94a3b8',
    fontSize: '14px',
    fontWeight: '500'
  };

  const footerStyle = {
    textAlign: 'center',
    fontSize: '13px',
    color: '#94a3b8',
    marginTop: '28px',
    lineHeight: '1.6'
  };

  const linkStyle = {
    color: '#06b6d4',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    fontWeight: '500'
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(1deg); }
            66% { transform: translateY(-10px) rotate(-1deg); }
          }
          
          @keyframes glow {
            0% { box-shadow: 0 15px 35px rgba(99, 102, 241, 0.4); }
            100% { box-shadow: 0 15px 35px rgba(139, 92, 246, 0.6); }
          }
          
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 10px;
          }
          
          .shimmer-effect::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            animation: shimmer 2s infinite;
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
      {[...Array(15)].map((_, i) => (
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

      {/* Main card */}
      <div style={cardStyle}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '40px'}}>
          <div style={logoStyle}>
            <span>✨</span>
          </div>
          <h1 style={titleStyle}>Welcome Back</h1>
          <p style={subtitleStyle}>Sign in to your TeamTask account</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin}>
          {/* Email field */}
          <div style={inputContainerStyle}>
            <span style={{...iconStyle, color: emailFocused ? '#06b6d4' : '#94a3b8'}}>📧</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="Enter your email"
              required
              style={{
                ...inputStyle,
                ...(emailFocused ? inputFocusStyle : {})
              }}
            />
          </div>

          {/* Password field */}
          <div style={inputContainerStyle}>
            <span style={{...iconStyle, color: passwordFocused ? '#06b6d4' : '#94a3b8'}}>🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder="Enter your password"
              required
              style={{
                ...inputStyle,
                paddingRight: '56px',
                ...(passwordFocused ? inputFocusStyle : {})
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={eyeButtonStyle}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="shimmer-effect"
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                Object.assign(e.target.style, buttonHoverStyle);
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 12px 30px rgba(99, 102, 241, 0.4)';
              }
            }}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <span style={{marginLeft: '8px', transition: 'transform 0.2s ease'}}>→</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={dividerStyle}>
          <div style={dividerLineStyle}></div>
          <span style={dividerTextStyle}>or</span>
        </div>

        {/* Register button */}
        <button
          onClick={goToRegister}
          style={secondaryButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(51, 65, 85, 0.6)';
            e.target.style.borderColor = 'rgba(148, 163, 184, 0.4)';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(30, 41, 59, 0.4)';
            e.target.style.borderColor = 'rgba(100, 116, 139, 0.3)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <span>Register</span>
          <span style={{marginLeft: '8px', color: '#06b6d4', fontWeight: 'bold'}}>•</span>
        </button>

        {/* Footer */}
        <p style={footerStyle}>
          By signing in, you agree to our{' '}
          <a href="#" style={linkStyle}>Terms of Service</a>
          {' '}and{' '}
          <a href="#" style={linkStyle}>Privacy Policy</a>
        </p>
      </div>

      {/* Bottom accent */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)',
        opacity: '0.6'
      }}></div>
    </div>
  );
};

export default Login;