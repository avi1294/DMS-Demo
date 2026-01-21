import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/tables/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

function RejectHoldPage() {
  const { documents, updateDocument, deleteDocument } = useData();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ open: false, doc: null });
  const [deleting, setDeleting] = useState(false);

  // Filter only rejected and on-hold documents
  const filteredData = useMemo(() => {
    const rejectedOrHold = documents.filter(
      (doc) => doc.status === 'rejected' || doc.status === 'hold'
    );

    if (statusFilter === 'all') {
      return rejectedOrHold;
    }
    return rejectedOrHold.filter((doc) => doc.status === statusFilter);
  }, [documents, statusFilter]);

  const rejectedCount = documents.filter((d) => d.status === 'rejected').length;
  const holdCount = documents.filter((d) => d.status === 'hold').length;

  const handleRestore = (doc) => {
    updateDocument(doc.id, { status: 'pending', rejectionReason: null, holdReason: null });
    toast.success(`Document "${doc.title}" restored to pending`);
  };

  const handleDeleteClick = (doc) => {
    setDeleteModal({ open: true, doc });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.doc) return;

    setDeleting(true);
    try {
      deleteDocument(deleteModal.doc.id);
      toast.success(`Document "${deleteModal.doc.title}" permanently deleted`);
    } catch (error) {
      toast.error('Failed to delete document');
    } finally {
      setDeleting(false);
      setDeleteModal({ open: false, doc: null });
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'rejected') {
      return <span className="badge badge-danger badge-status">Rejected</span>;
    }
    return <span className="badge badge-warning badge-status">On Hold</span>;
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
        header: 'Reason',
        cell: ({ row }) => {
          const reason = row.original.rejectionReason || row.original.holdReason;
          return reason || <span className="text-muted">No reason provided</span>;
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => getStatusBadge(getValue()),
      },
      {
        header: 'Date',
        accessorKey: 'updatedAt',
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
              className="btn btn-sm btn-success"
              onClick={() => handleRestore(row.original)}
              title="Restore to Pending"
            >
              <i className="fas fa-undo mr-1"></i>
              Restore
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDeleteClick(row.original)}
              title="Delete Permanently"
            >
              <i className="fas fa-trash mr-1"></i>
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="container-fluid fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="h3 mb-0 text-gray-800">Rejected / On Hold Documents</h1>
        <Link to="/data-entry/view" className="btn btn-secondary">
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Documents
        </Link>
      </div>

      {/* Stats Row */}
      <div className="row mb-4">
        <div className="col-xl-6 col-md-6 mb-4">
          <div className="card border-left-danger shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                    Rejected
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{rejectedCount}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-times-circle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    On Hold
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{holdCount}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-pause-circle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h6 className="m-0 font-weight-bold text-primary">
                Documents ({filteredData.length})
              </h6>
            </div>
            <div className="col-md-6 text-right">
              <select
                className="form-control form-control-sm d-inline-block"
                style={{ width: '150px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="rejected">Rejected</option>
                <option value="hold">On Hold</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-body">
          {filteredData.length === 0 ? (
            <EmptyState
              icon="fa-check-circle"
              title="No Rejected or On-Hold Documents"
              description="All documents are in good standing. No action needed."
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
        title="Delete Document Permanently"
        message={
          deleteModal.doc
            ? `Are you sure you want to permanently delete "${deleteModal.doc.title}"? This action cannot be undone.`
            : ''
        }
        confirmText="Delete Permanently"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

export default RejectHoldPage;
