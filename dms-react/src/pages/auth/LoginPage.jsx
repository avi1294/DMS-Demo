import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, error: authError, clearError } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Show auth errors
  useEffect(() => {
    if (authError) {
      setError(authError);
      clearError();
    }
  }, [authError, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success(`Welcome back, ${result.user.firstName}!`);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="card o-hidden border-0 shadow-lg my-5">
      <div className="card-body p-0">
        <div className="row">
          <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
          <div className="col-lg-6">
            <div className="p-5">
              <div className="text-center">
                <h1 className="h4 text-gray-900 mb-2">Welcome Back!</h1>
                <p className="text-muted mb-4">Sign in to access Document Management System</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  {error}
                </div>
              )}

              <form className="user" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    className={`form-control form-control-user ${error ? 'is-invalid' : ''}`}
                    name="email"
                    placeholder="Enter Email Address..."
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={`form-control form-control-user ${error ? 'is-invalid' : ''}`}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-user btn-block"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2"></span>
                      Signing in...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>

              <hr />

              {/* Demo Credentials */}
              <div className="text-center mb-3">
                <small className="text-muted">Demo Credentials:</small>
                <div className="small">
                  <code>admin@dms.com</code> / <code>admin123</code>
                </div>
              </div>

              <div className="text-center">
                <Link className="small" to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>
              <div className="text-center">
                <Link className="small" to="/register">
                  Create an Account!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
