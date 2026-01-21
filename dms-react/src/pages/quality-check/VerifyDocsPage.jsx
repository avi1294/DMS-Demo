import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { documentStatuses } from '../../data/seedData';

function VerifyDocsPage() {
  const { documents, verifyDocument, rejectDocument, holdDocument } = useData();
  const { user } = useAuth();
  const toast = useToast();

  const [statusFilter, setStatusFilter] = useState('pending');
  const [rejectModal, setRejectModal] = useState({ open: false, doc: null });
  const [holdModal, setHoldModal] = useState({ open: false, doc: null });
  const [reason, setReason] = useState('');
  const [viewModal, setViewModal] = useState({ open: false, doc: null });

  const filteredData = useMemo(() => {
    if (statusFilter === 'all') {
      return documents;
    }
    return documents.filter((doc) => doc.status === statusFilter);
  }, [documents, statusFilter]);

  const pendingCount = documents.filter((d) => d.status === 'pending').length;
  const verifiedCount = documents.filter((d) => d.status === 'verified').length;

  const handleVerify = (doc) => {
    const verifierName = user ? `${user.firstName} ${user.lastName}` : 'System';
    verifyDocument(doc.id, verifierName);
    toast.success(`Document "${doc.title}" verified successfully`);
  };

  const handleRejectClick = (doc) => {
    setRejectModal({ open: true, doc });
    setReason('');
  };

  const handleRejectConfirm = () => {
    if (!rejectModal.doc) return;

    if (!reason.trim()) {
      toast.warning('Please provide a reason for rejection');
      return;
    }

    rejectDocument(rejectModal.doc.id, reason);
    toast.error(`Document "${rejectModal.doc.title}" rejected`);
    setRejectModal({ open: false, doc: null });
    setReason('');
  };

  const handleHoldClick = (doc) => {
    setHoldModal({ open: true, doc });
    setReason('');
  };

  const handleHoldConfirm = () => {
    if (!holdModal.doc) return;

    if (!reason.trim()) {
      toast.warning('Please provide a reason for holding');
      return;
    }

    holdDocument(holdModal.doc.id, reason);
    toast.warning(`Document "${holdModal.doc.title}" placed on hold`);
    setHoldModal({ open: false, doc: null });
    setReason('');
  };

  const handleView = (doc) => {
    setViewModal({ open: true, doc });
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
        cell: ({ row }) => {
          const doc = row.original;
          return (
            <div className="action-buttons">
              <button
                className="btn btn-sm btn-info btn-icon-sm"
                onClick={() => handleView(doc)}
                title="View Details"
              >
                <i className="fas fa-eye"></i>
              </button>
              {doc.status === 'pending' && (
                <>
                  <button
                    className="btn btn-sm btn-success btn-icon-sm"
                    onClick={() => handleVerify(doc)}
                    title="Verify Document"
                  >
                    <i className="fas fa-check"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-warning btn-icon-sm"
                    onClick={() => handleHoldClick(doc)}
                    title="Put on Hold"
                  >
                    <i className="fas fa-pause"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger btn-icon-sm"
                    onClick={() => handleRejectClick(doc)}
                    title="Reject Document"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </>
              )}
            </div>
          );
        },
      },
    ],
    [user]
  );

  return (
    <div className="container-fluid fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="h3 mb-0 text-gray-800">Verify Documents</h1>
        <Link to="/scanning/reject-hold" className="btn btn-secondary">
          <i className="fas fa-ban mr-2"></i>
          View Rejected/Hold
        </Link>
      </div>

      {/* Stats Row */}
      <div className="row mb-4">
        <div className="col-xl-6 col-md-6 mb-4">
          <div
            className="card border-left-warning shadow h-100 py-2 cursor-pointer"
            onClick={() => setStatusFilter('pending')}
          >
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Pending Verification
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{pendingCount}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-clock fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-md-6 mb-4">
          <div
            className="card border-left-success shadow h-100 py-2 cursor-pointer"
            onClick={() => setStatusFilter('verified')}
          >
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Verified
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{verifiedCount}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-check-circle fa-2x text-gray-300"></i>
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
                {documentStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="card-body">
          {filteredData.length === 0 ? (
            <EmptyState
              icon="fa-clipboard-check"
              title="No Documents to Verify"
              description={
                statusFilter === 'pending'
                  ? 'All documents have been processed. Great job!'
                  : 'No documents found with this status.'
              }
            />
          ) : (
            <DataTable data={filteredData} columns={columns} searchable={false} />
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        show={rejectModal.open}
        title="Reject Document"
        onClose={() => setRejectModal({ open: false, doc: null })}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setRejectModal({ open: false, doc: null })}
            >
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleRejectConfirm}>
              Reject Document
            </button>
          </>
        }
      >
        <p>
          You are about to reject: <strong>{rejectModal.doc?.title}</strong>
        </p>
        <div className="form-group">
          <label className="required-field">Rejection Reason</label>
          <textarea
            className="form-control"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter the reason for rejection..."
            rows="3"
          />
        </div>
      </Modal>

      {/* Hold Modal */}
      <Modal
        show={holdModal.open}
        title="Put Document on Hold"
        onClose={() => setHoldModal({ open: false, doc: null })}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setHoldModal({ open: false, doc: null })}
            >
              Cancel
            </button>
            <button className="btn btn-warning" onClick={handleHoldConfirm}>
              Put on Hold
            </button>
          </>
        }
      >
        <p>
          You are about to put on hold: <strong>{holdModal.doc?.title}</strong>
        </p>
        <div className="form-group">
          <label className="required-field">Hold Reason</label>
          <textarea
            className="form-control"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter the reason for holding..."
            rows="3"
          />
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        show={viewModal.open}
        title="Document Details"
        onClose={() => setViewModal({ open: false, doc: null })}
        footer={
          <button
            className="btn btn-secondary"
            onClick={() => setViewModal({ open: false, doc: null })}
          >
            Close
          </button>
        }
      >
        {viewModal.doc && (
          <div>
            <div className="row mb-3">
              <div className="col-4 text-muted">Title:</div>
              <div className="col-8 font-weight-bold">{viewModal.doc.title}</div>
            </div>
            <div className="row mb-3">
              <div className="col-4 text-muted">Type:</div>
              <div className="col-8">{viewModal.doc.type}</div>
            </div>
            <div className="row mb-3">
              <div className="col-4 text-muted">Category:</div>
              <div className="col-8">{viewModal.doc.category}</div>
            </div>
            <div className="row mb-3">
              <div className="col-4 text-muted">Assigned To:</div>
              <div className="col-8">{viewModal.doc.memberName || 'Unassigned'}</div>
            </div>
            <div className="row mb-3">
              <div className="col-4 text-muted">Status:</div>
              <div className="col-8">{getStatusBadge(viewModal.doc.status)}</div>
            </div>
            <div className="row mb-3">
              <div className="col-4 text-muted">Page Count:</div>
              <div className="col-8">{viewModal.doc.pageCount || '-'}</div>
            </div>
            <div className="row mb-3">
              <div className="col-4 text-muted">Notes:</div>
              <div className="col-8">{viewModal.doc.notes || 'No notes'}</div>
            </div>
            {viewModal.doc.verifiedBy && (
              <div className="row mb-3">
                <div className="col-4 text-muted">Verified By:</div>
                <div className="col-8">{viewModal.doc.verifiedBy}</div>
              </div>
            )}
            <div className="row mb-3">
              <div className="col-4 text-muted">Created:</div>
              <div className="col-8">
                {viewModal.doc.createdAt
                  ? new Date(viewModal.doc.createdAt).toLocaleString()
                  : '-'}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default VerifyDocsPage;
