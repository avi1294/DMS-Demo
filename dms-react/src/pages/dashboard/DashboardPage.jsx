import StatCard from '../../components/common/StatCard'
import Card from '../../components/common/Card'
import AreaChart from '../../components/charts/AreaChart'
import PieChart from '../../components/charts/PieChart'
import illustrationImg from '../../assets/img/undraw_posting_photo.svg'

function DashboardPage() {
  const stats = [
    {
      title: 'Total Scanned Documents',
      value: '4000',
      icon: 'fa-check',
      borderColor: 'primary'
    },
    {
      title: 'Documents Verified',
      value: '2150',
      icon: 'fa-tasks',
      borderColor: 'success'
    },
    {
      title: 'Scanned Documents',
      value: '80%',
      icon: 'fa-clipboard-list',
      borderColor: 'info',
      progress: 80
    },
    {
      title: 'Scan Pending',
      value: '18',
      icon: 'fa-qrcode',
      borderColor: 'warning'
    }
  ]

  const projects = [
    { name: 'Server Migration', progress: 20, color: 'bg-danger' },
    { name: 'Sales Tracking', progress: 40, color: 'bg-warning' },
    { name: 'Customer Database', progress: 60, color: '' },
    { name: 'Payout Details', progress: 80, color: 'bg-info' },
    { name: 'Account Setup', progress: 100, color: 'bg-success', label: 'Complete!' }
  ]

  const handleGenerateReport = () => {
    if (window.confirm('Sure want to print the report?')) {
      // Generate report logic here
      console.log('Generating report...')
    }
  }

  return (
    <div className="container-fluid">
      {/* Page Heading */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleGenerateReport}
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
          <i className="fas fa-download fa-sm text-white-50"></i> Generate Report
        </button>
      </div>

      {/* Content Row - Stats */}
      <div className="row">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            borderColor={stat.borderColor}
            progress={stat.progress}
          />
        ))}
      </div>

      {/* Content Row - Charts */}
      <div className="row">
        {/* Area Chart */}
        <div className="col-xl-8 col-lg-7">
          <Card title="Earnings Overview">
            <AreaChart />
          </Card>
        </div>

        {/* Pie Chart */}
        <div className="col-xl-4 col-lg-5">
          <Card title="Revenue Sources">
            <PieChart />
            <div className="mt-4 text-center small">
              <span className="mr-2">
                <i className="fas fa-circle text-primary"></i> Direct
              </span>
              <span className="mr-2">
                <i className="fas fa-circle text-success"></i> Social
              </span>
              <span className="mr-2">
                <i className="fas fa-circle text-info"></i> Referral
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Content Row */}
      <div className="row">
        {/* Projects Card */}
        <div className="col-lg-6 mb-4">
          <Card title="Projects">
            {projects.map((project, index) => (
              <div key={index}>
                <h4 className="small font-weight-bold">
                  {project.name}{' '}
                  <span className="float-right">
                    {project.label || `${project.progress}%`}
                  </span>
                </h4>
                <div className={`progress ${index < projects.length - 1 ? 'mb-4' : ''}`}>
                  <div
                    className={`progress-bar ${project.color}`}
                    role="progressbar"
                    style={{ width: `${project.progress}%` }}
                    aria-valuenow={project.progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Illustrations Card */}
        <div className="col-lg-6 mb-4">
          <Card title="Illustrations">
            <div className="text-center">
              <img
                className="img-fluid px-3 px-sm-4 mt-3 mb-4"
                style={{ width: '25rem' }}
                src={illustrationImg}
                alt="Illustration"
              />
            </div>
            <p>
              Add some quality, svg illustrations to your project courtesy of{' '}
              <a target="_blank" rel="nofollow noopener noreferrer" href="https://undraw.co/">
                unDraw
              </a>
              , a constantly updated collection of beautiful svg images that you can use completely
              free and without attribution!
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
