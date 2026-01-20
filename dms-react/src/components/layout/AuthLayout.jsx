import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className="bg-gradient-primary min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row w-100 justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
