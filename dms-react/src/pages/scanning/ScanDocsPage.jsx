import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { scanStatuses } from '../../data/seedData';

function ScanDocsPage() {
  const { scanQueue, addToScanQueue, updateScanStatus, deleteScanItem } = useData();
  const toast = useToast();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewBatchModal, setShowNewBatchModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

  const [newBatch, setNewBatch] = useState({
    batchName: '',
    documentCount: '',
    priority: 'medium',
    notes: '',
  });

  const filteredData = useMemo(() => {
    return scanQueue.filter((item) => {
      return statusFilter === 'all' || item.status === statusFilter;
    });
  }, [scanQueue, statusFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = scanStatuses.find((s) => s.value === status);
    return (
      <span className={`badge badge-${statusConfig?.color || 'secondary'} badge-status`}>
        {statusConfig?.label || status}
      </span>
    );
  };

  const handleCreateBatch = () => {
    if (!newBatch.batchName.trim()) {
      toast.warning('Please enter a batch name');
      return;
    }

    addToScanQueue({
      batchName: newBatch.batchName,
      documentCount: parseInt(newBatch.documentCount) || 0,
      priority: newBatch.priority,
      notes: newBatch.notes,
      status: 'pending',
    });

    toast.success(`Batch "${newBatch.batchName}" created successfully`);
    setShowNewBatchModal(false);
    setNewBatch({ batchName: '', documentCount: '', priority: 'medium', notes: '' });
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.warning('Please select a file to upload');
      return;
    }

    if (selectedBatch) {
      updateScanStatus(selectedBatch.id, 'in_progress', `Uploading ${selectedFile.name}`);
      toast.success(`Documents uploaded to batch "${selectedBatch.batchName}"`);
    } else {
      toast.success('Documents uploaded successfully');
    }

    setShowUploadModal(false);
    setSelectedFile(null);
    setSelectedBatch(null);
  };

  const handleStartScan = (item) => {
    updateScanStatus(item.id, 'in_progress');
    toast.info(`Started scanning batch "${item.batchName}"`);
  };

  const handleCompleteScan = (item) => {
    updateScanStatus(item.id, 'completed');
    toast.success(`Batch "${item.batchName}" completed successfully`);
  };

  const handleHoldScan = (item) => {
    updateScanStatus(item.id, 'hold', 'Placed on hold for review');
    toast.warning(`Batch "${item.batchName}" placed on hold`);
  };

  const handleDeleteClick = (item) => {
    setDeleteModal({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;

    setDeleting(true);
    try {
      deleteScanItem(deleteModal.item.id);
      toast.success(`Batch "${deleteModal.item.batchName}" deleted`);
    } catch (error) {
      toast.error('Failed to delete batch');
    } finally {
      setDeleting(false);
      setDeleteModal({ open: false, item: null });
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'Batch Name',
        accessorKey: 'batchName',
        cell: ({ row }) => (
          <div>
            <div className="font-weight-bold">{row.original.batchName}</div>
            <small className="text-muted">
              {row.original.documentCount} documents
            </small>
          </div>
        ),
      },
      {
        header: 'Priority',
        accessorKey: 'priority',
        cell: ({ getValue }) => {
          const priority = getValue();
          const colors = {
            low: 'secondary',
            medium: 'info',
            high: 'warning',
            urgent: 'danger',
          };
          return (
            <span className={`badge badge-${colors[priority] || 'secondary'}`}>
              {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
            </span>
          );
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => getStatusBadge(getValue()),
      },
      {
        header: 'Scanned By',
        accessorKey: 'scannedBy',
        cell: ({ getValue }) => getValue() || <span className="text-muted">Unassigned</span>,
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
          const item = row.original;
          return (
            <div className="action-buttons">
              {item.status === 'pending' && (
                <button
                  className="btn btn-sm btn-primary btn-icon-sm"
                  onClick={() => handleStartScan(item)}
                  title="Start Scanning"
                >
                  <i className="fas fa-play"></i>
                </button>
              )}
              {item.status === 'in_progress' && (
                <>
                  <button
                    className="btn btn-sm btn-success btn-icon-sm"
                    onClick={() => handleCompleteScan(item)}
                    title="Mark Complete"
                  >
                    <i className="fas fa-check"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-warning btn-icon-sm"
                    onClick={() => handleHoldScan(item)}
                    title="Put on Hold"
                  >
                    <i className="fas fa-pause"></i>
                  </button>
                </>
              )}
              <button
                className="btn btn-sm btn-info btn-icon-sm"
                onClick={() => {
                  setSelectedBatch(item);
                  setShowUploadModal(true);
                }}
                title="Upload Documents"
              >
                <i className="fas fa-upload"></i>
              </button>
              <button
                className="btn btn-sm btn-danger btn-icon-sm"
                onClick={() => handleDeleteClick(item)}
                title="Delete Batch"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="container-fluid fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="h3 mb-0 text-gray-800">Scan Documents</h1>
        <button className="btn btn-primary" onClick={() => setShowNewBatchModal(true)}>
          <i className="fas fa-plus mr-2"></i>
          New Batch
        </button>
      </div>

      {/* Stats Row */}
      <div className="row mb-4">
        {scanStatuses.slice(0, 4).map((status) => {
          const count = scanQueue.filter((s) => s.status === status.value).length;
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
                      <i className="fas fa-scanner fa-2x text-gray-300"></i>
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
            <div className="col-md-6">
              <h6 className="m-0 font-weight-bold text-primary">
                Scan Queue ({filteredData.length})
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
                {scanStatuses.map((s) => (
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
              icon="fa-file-upload"
              title="No Scan Batches"
              description="Create a new batch to start scanning documents."
              actionText="Create Batch"
              onAction={() => setShowNewBatchModal(true)}
            />
          ) : (
            <DataTable data={filteredData} columns={columns} searchable={false} />
          )}
        </div>
      </div>

      {/* New Batch Modal */}
      <Modal
        show={showNewBatchModal}
        title="Create New Scan Batch"
        onClose={() => setShowNewBatchModal(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowNewBatchModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateBatch}>
              Create Batch
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="required-field">Batch Name</label>
          <input
            type="text"
            className="form-control"
            value={newBatch.batchName}
            onChange={(e) => setNewBatch({ ...newBatch, batchName: e.target.value })}
            placeholder="e.g., Batch-2024-001"
          />
        </div>
        <div className="form-group">
          <label>Expected Document Count</label>
          <input
            type="number"
            className="form-control"
            value={newBatch.documentCount}
            onChange={(e) => setNewBatch({ ...newBatch, documentCount: e.target.value })}
            placeholder="0"
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select
            className="form-control"
            value={newBatch.priority}
            onChange={(e) => setNewBatch({ ...newBatch, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea
            className="form-control"
            value={newBatch.notes}
            onChange={(e) => setNewBatch({ ...newBatch, notes: e.target.value })}
            placeholder="Add notes about this batch..."
            rows="2"
          />
        </div>
      </Modal>

      {/* Upload Modal */}
      <Modal
        show={showUploadModal}
        title={selectedBatch ? `Upload to ${selectedBatch.batchName}` : 'Upload Documents'}
        onClose={() => {
          setShowUploadModal(false);
          setSelectedFile(null);
          setSelectedBatch(null);
        }}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowUploadModal(false);
                setSelectedFile(null);
                setSelectedBatch(null);
              }}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleUpload}>
              Upload
            </button>
          </>
        }
      >
        <div className="text-center py-4">
          <label
            htmlFor="uploadDocs"
            className="btn btn-outline-primary"
            style={{
              cursor: 'pointer',
              padding: '40px',
              border: '2px dashed #4e73df',
              width: '100%',
              borderRadius: '8px',
            }}
          >
            <i className="fas fa-cloud-upload-alt fa-3x mb-3 d-block"></i>
            <span>Click to select files or drag and drop</span>
          </label>
          <input
            type="file"
            id="uploadDocs"
            style={{ display: 'none' }}
            onChange={(e) => setSelectedFile(e.target.files[0])}
            multiple
          />
          <div className="mt-3">
            {selectedFile ? (
              <div className="alert alert-success mb-0">
                <i className="fas fa-file mr-2"></i>
                {selectedFile.name}
              </div>
            ) : (
              <span className="text-muted">No file selected</span>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Batch"
        message={
          deleteModal.item
            ? `Are you sure you want to delete batch "${deleteModal.item.batchName}"?`
            : ''
        }
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

export default ScanDocsPage;
