import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    // Simulate password reset - in real app, call API here
    setSuccess(true)
    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }

  return (
    <div className="card o-hidden border-0 shadow-lg my-5">
      <div className="card-body p-0">
        <div className="row">
          <div className="col-lg-6 d-none d-lg-block bg-password-image"></div>
          <div className="col-lg-6">
            <div className="p-5">
              <div className="text-center">
                <h1 className="h4 text-gray-900 mb-2">Forgot Your Password?</h1>
                <p className="mb-4">
                  We get it, stuff happens. Just enter your email address below and we'll send you
                  a link to reset your password!
                </p>
              </div>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success" role="alert">
                  Password reset link has been sent to your email. Redirecting to login...
                </div>
              )}
              <form className="user" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control form-control-user"
                    placeholder="Enter Email Address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={success}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-user btn-block"
                  disabled={success}
                >
                  Reset Password
                </button>
              </form>
              <hr />
              <div className="text-center">
                <Link className="small" to="/register">
                  Create an Account!
                </Link>
              </div>
              <div className="text-center">
                <Link className="small" to="/login">
                  Already have an account? Login!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
