import { getCurrentYear } from '../../utils/formatters'

function Footer() {
  return (
    <footer className="sticky-footer bg-white">
      <div className="container my-auto">
        <div className="copyright text-center my-auto">
          <span>Copyright &copy; Document Management System {getCurrentYear()}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
