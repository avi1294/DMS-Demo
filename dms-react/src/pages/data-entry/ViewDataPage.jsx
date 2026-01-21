import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/tables/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { documentStatuses } from '../../data/seedData';

function ViewDataPage() {
  const { documents, deleteDocument, loading } = useData();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ open: false, doc: null });
  const [deleting, setDeleting] = useState(false);

  // Get unique categories from documents
  const categories = useMemo(() => {
    const cats = [...new Set(documents.map((d) => d.category).filter(Boolean))];
    return cats.sort();
  }, [documents]);

  const filteredData = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [documents, searchTerm, statusFilter, categoryFilter]);

  const handleDeleteClick = (doc) => {
    setDeleteModal({ open: true, doc });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.doc) return;

    setDeleting(true);
    try {
      const success = deleteDocument(deleteModal.doc.id);
      if (success) {
        toast.success(`Document "${deleteModal.doc.title}" deleted successfully`);
      } else {
        toast.error('Failed to delete document');
      }
    } catch (error) {
      toast.error('An error occurred while deleting');
    } finally {
      setDeleting(false);
      setDeleteModal({ open: false, doc: null });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = documentStatuses.find((s) => s.value === status);
    return (
      <span className={`badge badge-${statusConfig?.color || 'secondary'} badge-status`}>
        {statusConfig?.label || status}
      </span>
    );
  };

  const columns = useMemo(
    () => [
      {
        header: 'Document',
        accessorKey: 'title',
        cell: ({ row }) => (
          <div>
            <div className="font-weight-bold">{row.original.title}</div>
            <small className="text-muted">
              {row.original.type} | {row.original.category}
            </small>
          </div>
        ),
      },
      {
        header: 'Assigned To',
        accessorKey: 'memberName',
        cell: ({ getValue }) => getValue() || <span className="text-muted">Unassigned</span>,
      },
      {
        header: 'Pages',
        accessorKey: 'pageCount',
        cell: ({ getValue }) => getValue() || '-',
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => getStatusBadge(getValue()),
      },
      {
        header: 'Created',
        accessorKey: 'createdAt',
        cell: ({ getValue }) => {
          const date = getValue();
          return date ? new Date(date).toLocaleDateString() : '-';
        },
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="action-buttons">
            <button
              className="btn btn-sm btn-info btn-icon-sm"
              title="View Details"
              onClick={() => toast.info(`Viewing: ${row.original.title}`)}
            >
              <i className="fas fa-eye"></i>
            </button>
            <button
              className="btn btn-sm btn-danger btn-icon-sm"
              onClick={() => handleDeleteClick(row.original)}
              title="Delete Document"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    [toast]
  );

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading documents..." />;
  }

  return (
    <div className="container-fluid fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="h3 mb-0 text-gray-800">View Documents</h1>
        <Link to="/data-entry/add" className="btn btn-primary">
          <i className="fas fa-plus mr-2"></i>
          Add Document
        </Link>
      </div>

      {/* Stats Row */}
      <div className="row mb-4">
        {documentStatuses.map((status) => {
          const count = documents.filter((d) => d.status === status.value).length;
          return (
            <div key={status.value} className="col-xl-3 col-md-6 mb-4">
              <div className={`card border-left-${status.color} shadow h-100 py-2`}>
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className={`text-xs font-weight-bold text-${status.color} text-uppercase mb-1`}>
                        {status.label}
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">{count}</div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-file-alt fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Card */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <div className="row align-items-center">
            <div className="col-md-4">
              <h6 className="m-0 font-weight-bold text-primary">
                Documents ({filteredData.length})
              </h6>
            </div>
            <div className="col-md-8">
              <div className="d-flex gap-2 justify-content-end flex-wrap">
                <div className="search-box" style={{ minWidth: '200px' }}>
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="search"
                    className="form-control form-control-sm"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="form-control form-control-sm"
                  style={{ width: '140px' }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  {documentStatuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <select
                  className="form-control form-control-sm"
                  style={{ width: '150px' }}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {filteredData.length === 0 ? (
            <EmptyState
              icon="fa-file-alt"
              title="No Documents Found"
              description={
                searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'No documents match your search criteria.'
                  : 'Get started by adding your first document.'
              }
              actionText={
                !searchTerm && statusFilter === 'all' && categoryFilter === 'all'
                  ? 'Add Document'
                  : ''
              }
              onAction={() => (window.location.href = '/data-entry/add')}
            />
          ) : (
            <DataTable data={filteredData} columns={columns} searchable={false} />
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, doc: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Document"
        message={
          deleteModal.doc
            ? `Are you sure you want to delete "${deleteModal.doc.title}"? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

export default ViewDataPage;
