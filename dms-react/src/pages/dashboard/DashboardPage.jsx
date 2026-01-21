import { Link } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import AreaChart from '../../components/charts/AreaChart';
import PieChart from '../../components/charts/PieChart';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

function DashboardPage() {
  const { getStats, documents, members, scanQueue } = useData();
  const { user } = useAuth();
  const toast = useToast();

  const stats = getStats();

  // Calculate verification percentage
  const verificationRate = stats.totalDocuments > 0
    ? Math.round((stats.verifiedDocuments / stats.totalDocuments) * 100)
    : 0;

  const statCards = [
    {
      title: 'Total Documents',
      value: stats.totalDocuments.toString(),
      icon: 'fa-file-alt',
      borderColor: 'primary',
    },
    {
      title: 'Documents Verified',
      value: stats.verifiedDocuments.toString(),
      icon: 'fa-check-circle',
      borderColor: 'success',
    },
    {
      title: 'Verification Rate',
      value: `${verificationRate}%`,
      icon: 'fa-clipboard-check',
      borderColor: 'info',
      progress: verificationRate,
    },
    {
      title: 'Pending Review',
      value: stats.pendingDocuments.toString(),
      icon: 'fa-clock',
      borderColor: 'warning',
    },
  ];

  // Document status breakdown for progress bars
  const documentBreakdown = [
    {
      name: 'Verified Documents',
      progress: stats.totalDocuments > 0 ? Math.round((stats.verifiedDocuments / stats.totalDocuments) * 100) : 0,
      color: 'bg-success',
      count: stats.verifiedDocuments,
    },
    {
      name: 'Pending Documents',
      progress: stats.totalDocuments > 0 ? Math.round((stats.pendingDocuments / stats.totalDocuments) * 100) : 0,
      color: 'bg-warning',
      count: stats.pendingDocuments,
    },
    {
      name: 'On Hold Documents',
      progress: stats.totalDocuments > 0 ? Math.round((stats.holdDocuments / stats.totalDocuments) * 100) : 0,
      color: 'bg-info',
      count: stats.holdDocuments,
    },
    {
      name: 'Rejected Documents',
      progress: stats.totalDocuments > 0 ? Math.round((stats.rejectedDocuments / stats.totalDocuments) * 100) : 0,
      color: 'bg-danger',
      count: stats.rejectedDocuments,
    },
  ];

  // Recent documents
  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Recent members
  const recentMembers = [...members]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const handleGenerateReport = () => {
    toast.info('Generating report... This feature will be available soon.');
  };

  return (
    <div className="container-fluid fade-in">
      {/* Page Heading */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
          {user && (
            <p className="mb-0 text-muted">
              Welcome back, {user.firstName}!
            </p>
          )}
        </div>
        <button
          onClick={handleGenerateReport}
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
          <i className="fas fa-download fa-sm text-white-50 mr-1"></i>
          Generate Report
        </button>
      </div>

      {/* Content Row - Stats */}
      <div className="row">
        {statCards.map((stat, index) => (
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
          <Card title="Document Processing Overview">
            <AreaChart />
          </Card>
        </div>

        {/* Pie Chart */}
        <div className="col-xl-4 col-lg-5">
          <Card title="Document Status">
            <PieChart />
            <div className="mt-4 text-center small">
              <span className="mr-2">
                <i className="fas fa-circle text-success"></i> Verified ({stats.verifiedDocuments})
              </span>
              <span className="mr-2">
                <i className="fas fa-circle text-warning"></i> Pending ({stats.pendingDocuments})
              </span>
              <span className="mr-2">
                <i className="fas fa-circle text-danger"></i> Rejected ({stats.rejectedDocuments})
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Content Row */}
      <div className="row">
        {/* Document Status Breakdown */}
        <div className="col-lg-6 mb-4">
          <Card title="Document Status Breakdown">
            {documentBreakdown.map((item, index) => (
              <div key={index}>
                <h4 className="small font-weight-bold">
                  {item.name}
                  <span className="float-right">
                    {item.count} ({item.progress}%)
                  </span>
                </h4>
                <div className={`progress ${index < documentBreakdown.length - 1 ? 'mb-4' : ''}`}>
                  <div
                    className={`progress-bar ${item.color}`}
                    role="progressbar"
                    style={{ width: `${item.progress}%` }}
                    aria-valuenow={item.progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="col-lg-6 mb-4">
          <Card title="Quick Stats">
            <div className="row">
              <div className="col-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                  <div className="card-body py-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Total Members
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {stats.totalMembers}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 mb-4">
                <div className="card border-left-success shadow h-100 py-2">
                  <div className="card-body py-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Active Members
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {stats.activeMembers}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 mb-4">
                <div className="card border-left-info shadow h-100 py-2">
                  <div className="card-body py-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Scan Queue
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {stats.totalScans}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 mb-4">
                <div className="card border-left-warning shadow h-100 py-2">
                  <div className="card-body py-2">
                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                      Pending Scans
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {stats.pendingScans}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity Row */}
      <div className="row">
        {/* Recent Documents */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
              <h6 className="m-0 font-weight-bold text-primary">Recent Documents</h6>
              <Link to="/data-entry/view" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentDocuments.length === 0 ? (
                <p className="text-muted text-center mb-0">No documents yet</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm mb-0">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDocuments.map((doc) => (
                        <tr key={doc.id}>
                          <td className="font-weight-bold">{doc.title}</td>
                          <td>
                            <span className={`badge badge-${
                              doc.status === 'verified' ? 'success' :
                              doc.status === 'pending' ? 'warning' :
                              doc.status === 'rejected' ? 'danger' : 'info'
                            }`}>
                              {doc.status}
                            </span>
                          </td>
                          <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Members */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
              <h6 className="m-0 font-weight-bold text-primary">Recent Members</h6>
              <Link to="/members" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentMembers.length === 0 ? (
                <p className="text-muted text-center mb-0">No members yet</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentMembers.map((member) => (
                        <tr key={member.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar avatar-sm bg-primary text-white mr-2">
                                {member.firstName?.[0]}{member.lastName?.[0]}
                              </div>
                              {member.firstName} {member.lastName}
                            </div>
                          </td>
                          <td>{member.department}</td>
                          <td>
                            <span className={`badge badge-${member.status === 'active' ? 'success' : 'secondary'}`}>
                              {member.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
