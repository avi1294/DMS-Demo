import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/tables/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

function MembersPage() {
  const { members, deleteMember, loading } = useData();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ open: false, member: null });
  const [deleting, setDeleting] = useState(false);

  const filteredData = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [members, searchTerm, statusFilter]);

  const handleDeleteClick = (member) => {
    setDeleteModal({ open: true, member });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.member) return;

    setDeleting(true);
    try {
      const success = deleteMember(deleteModal.member.id);
      if (success) {
        toast.success(`Member "${deleteModal.member.firstName} ${deleteModal.member.lastName}" deleted successfully`);
      } else {
        toast.error('Failed to delete member');
      }
    } catch (error) {
      toast.error('An error occurred while deleting');
    } finally {
      setDeleting(false);
      setDeleteModal({ open: false, member: null });
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'Member',
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <div
              className="avatar bg-primary text-white mr-3"
              title={`${row.original.firstName} ${row.original.lastName}`}
            >
              {row.original.firstName?.[0]}
              {row.original.lastName?.[0]}
            </div>
            <div>
              <div className="font-weight-bold">
                {row.original.firstName} {row.original.lastName}
              </div>
              <small className="text-muted">{row.original.email}</small>
            </div>
          </div>
        ),
      },
      {
        header: 'Phone',
        accessorKey: 'phone',
        cell: ({ getValue }) => getValue() || '-',
      },
      {
        header: 'Department',
        accessorKey: 'department',
        cell: ({ getValue }) => getValue() || '-',
      },
      {
        header: 'Role',
        accessorKey: 'role',
        cell: ({ getValue }) => getValue() || '-',
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => {
          const status = getValue();
          return (
            <span className={`badge badge-status status-${status}`}>
              {status === 'active' ? 'Active' : 'Inactive'}
            </span>
          );
        },
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="action-buttons">
            <Link
              to={`/members/edit/${row.original.id}`}
              className="btn btn-sm btn-success btn-icon-sm"
              title="Edit Member"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <button
              className="btn btn-sm btn-danger btn-icon-sm"
              onClick={() => handleDeleteClick(row.original)}
              title="Delete Member"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    []
  );

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading members..." />;
  }

  return (
    <div className="container-fluid fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="h3 mb-0 text-gray-800">Manage Members</h1>
        <Link to="/members/add" className="btn btn-primary">
          <i className="fas fa-plus mr-2"></i>
          Add Member
        </Link>
      </div>

      {/* Main Card */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h6 className="m-0 font-weight-bold text-primary">
                Members ({filteredData.length})
              </h6>
            </div>
            <div className="col-md-6">
              <div className="d-flex gap-2 justify-content-end">
                <div className="search-box" style={{ maxWidth: '250px' }}>
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="search"
                    className="form-control form-control-sm"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="form-control form-control-sm"
                  style={{ width: '130px' }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {filteredData.length === 0 ? (
            <EmptyState
              icon="fa-users"
              title="No Members Found"
              description={
                searchTerm || statusFilter !== 'all'
                  ? 'No members match your search criteria.'
                  : 'Get started by adding your first team member.'
              }
              actionText={!searchTerm && statusFilter === 'all' ? 'Add Member' : ''}
              onAction={() => (window.location.href = '/members/add')}
            />
          ) : (
            <DataTable data={filteredData} columns={columns} searchable={false} />
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, member: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Member"
        message={
          deleteModal.member
            ? `Are you sure you want to delete "${deleteModal.member.firstName} ${deleteModal.member.lastName}"? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

export default MembersPage;
