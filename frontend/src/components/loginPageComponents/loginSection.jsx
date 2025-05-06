import React, { useState, useEffect } from 'react';
import { Form, Formik } from 'formik';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import Input from './input';
import Request from '../utils/request';
import './style.css';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

const LoginSection = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationLink, setShowVerificationLink] = useState(false);
  const [lastAttemptedEmail, setLastAttemptedEmail] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.verified) {
      setSuccessMessage('Email verified successfully! You can now log in.');
    }
    
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

  const handleLogin = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setShowVerificationLink(false);
    setLastAttemptedEmail(values.email);
    
    try {
      await Request.login(values.email, values.password);
      
      resetForm();
      
      return window.location.href = '/dashboard';
    } catch (error) {
      if (error.message === 'Account not verified') {
        setErrorMessage('Your account is not verified. Please verify your email to continue.');
        setShowVerificationLink(true);
      } else {
        setErrorMessage(error.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            Sign in to <span className="brand-highlight">finance tracker</span>
          </h1>
          <p className="auth-subtitle">
            Manage your finances seamlessly with our powerful tracking tools.
          </p>
        </div>
        
        {successMessage && (
          <div className="success-alert">
            {successMessage}
          </div>
        )}
        
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, errors, touched, values }) => (
            <Form className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <Input
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  aria-label="Email"
                />
                {errors.email && touched.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="password-field">
                  <Input
                    name="password"
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                    aria-label="Password"
                  />
                </div>
                {errors.password && touched.password && (
                  <div className="error-message">{errors.password}</div>
                )}
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>
              
              {errorMessage && (
                <div className="error-alert">
                  {errorMessage}
                  {showVerificationLink && (
                    <div className="verification-link-container">
                      <Link 
                        to={`/verify-email`} 
                        state={{ email: lastAttemptedEmail || values.email }}
                        className="verification-link"
                      >
                        Go to verification page
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              <button
                type="submit"
                className="btn-auth"
                disabled={isSubmitting || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading"></span>
                    Logging in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <div className="auth-alternate">
          Don't have an account?{' '}
          <Link to="/register" className="auth-alternate-link">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginSection;