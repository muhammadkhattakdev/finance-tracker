import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './style.css';
import Request from '../../utils/request';

const EmailVerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const inputRefs = Array(6).fill(0).map(() => React.createRef());
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const stateEmail = location.state?.email;
    
    if (emailParam) {
      setEmail(emailParam);
    } else if (stateEmail) {
      setEmail(stateEmail);
    }
    
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, [location]);
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);
  
  const handleInputChange = (index, e) => {
    const value = e.target.value;
    
    if (value && !/^\d*$/.test(value)) {
      return;
    }
    
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);
    
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
    
    if (value && index === 5 && newVerificationCode.every(digit => digit)) {
      handleVerify();
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };
  
  const handleVerify = async () => {
    if (verificationCode.some(digit => !digit)) {
      setError('Please enter the complete verification code.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const code = verificationCode.join('');
      await Request.verifyEmail(email, code);
      
      setSuccess('Email verified successfully! You will be redirected to the login page.');
      
      setTimeout(() => {
        navigate('/dashboard', { state: { verified: true, email } });
      }, 2000);
      
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message || 'Failed to verify email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    if (resendDisabled) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await Request.resendVerification(email);
      
      setSuccess('A new verification code has been sent to your email.');
      setResendDisabled(true);
      setCountdown(60); // 60 seconds cooldown
      
      // Reset the verification code inputs
      setVerificationCode(['', '', '', '', '', '']);
      if (inputRefs[0].current) {
        inputRefs[0].current.focus();
      }
      
    } catch (err) {
      console.error('Resend error:', err);
      setError(err.message || 'Failed to resend verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            Email <span className="brand-highlight">Verification</span>
          </h1>
          <p className="auth-subtitle">
            We've sent a verification code to <strong>{email}</strong>. Please enter the code below to verify your email.
          </p>
        </div>
        
        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-alert">
            {success}
          </div>
        )}
        
        <div className="verification-code-inputs">
          {verificationCode.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isLoading}
              className="code-input"
            />
          ))}
        </div>
        
        <div className="verify-actions">
          <button 
            className="btn-auth"
            onClick={handleVerify}
            disabled={isLoading || verificationCode.some(digit => !digit)}
          >
            {isLoading ? (
              <>
                <span className="loading"></span>
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </button>
          
          <div className="auth-alternate">
            <p>Didn't receive a code?</p>
            <button 
              className="resend-button" 
              onClick={handleResendCode}
              disabled={isLoading || resendDisabled}
            >
              {resendDisabled 
                ? `Resend code (${countdown}s)` 
                : 'Resend code'}
            </button>
          </div>
        </div>
        
        <div className="verification-info-div">
          <p>The verification code will expire in 5 minutes.</p>
          <p>If you don't verify your email, you won't be able to use your account.</p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;