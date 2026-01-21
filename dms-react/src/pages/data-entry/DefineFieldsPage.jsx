import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

function DefineFieldsPage() {
  const { fields, addField, updateField, deleteField } = useData();
  const toast = useToast();

  const [newField, setNewField] = useState({
    name: '',
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
    options: '',
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, field: null });
  const [deleting, setDeleting] = useState(false);

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'select', label: 'Dropdown' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Phone' },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!newField.name.trim()) {
      newErrors.name = 'Field name is required';
    }
    if (!newField.label.trim()) {
      newErrors.label = 'Field label is required';
    }
    if (newField.type === 'select' && !newField.options.trim()) {
      newErrors.options = 'Options are required for dropdown fields';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddField = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warning('Please fill in all required fields');
      return;
    }

    const fieldData = {
      name: newField.name.trim().toLowerCase().replace(/\s+/g, '_'),
      label: newField.label.trim(),
      type: newField.type,
      required: newField.required,
      placeholder: newField.placeholder.trim(),
      options: newField.type === 'select'
        ? newField.options.split(',').map((o) => o.trim()).filter(Boolean)
        : [],
      order: fields.length + 1,
    };

    if (editingId) {
      updateField(editingId, fieldData);
      toast.success(`Field "${fieldData.label}" updated successfully`);
      setEditingId(null);
    } else {
      addField(fieldData);
      toast.success(`Field "${fieldData.label}" added successfully`);
    }

    setNewField({
      name: '',
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: '',
    });
    setErrors({});
  };

  const handleEditField = (field) => {
    setEditingId(field.id);
    setNewField({
      name: field.name || '',
      label: field.label || '',
      type: field.type || 'text',
      required: field.required || false,
      placeholder: field.placeholder || '',
      options: Array.isArray(field.options) ? field.options.join(', ') : '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewField({
      name: '',
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: '',
    });
    setErrors({});
  };

  const handleDeleteClick = (field) => {
    setDeleteModal({ open: true, field });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.field) return;

    setDeleting(true);
    try {
      const success = deleteField(deleteModal.field.id);
      if (success) {
        toast.success(`Field "${deleteModal.field.label}" deleted successfully`);
      } else {
        toast.error('Failed to delete field');
      }
    } catch (error) {
      toast.error('An error occurred while deleting');
    } finally {
      setDeleting(false);
      setDeleteModal({ open: false, field: null });
    }
  };

  return (
    <div className="container-fluid fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="h3 mb-0 text-gray-800">Define Fields</h1>
      </div>

      <div className="row">
        {/* Add/Edit Field Form */}
        <div className="col-lg-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                {editingId ? 'Edit Field' : 'Add New Field'}
              </h6>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddField}>
                {/* Field Label */}
                <div className="form-group">
                  <label className="required-field">Field Label</label>
                  <input
                    type="text"
                    className={`form-control ${errors.label ? 'is-invalid' : ''}`}
                    value={newField.label}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    placeholder="e.g., Document Title"
                  />
                  {errors.label && <div className="invalid-feedback">{errors.label}</div>}
                </div>

                {/* Field Name */}
                <div className="form-group">
                  <label className="required-field">Field Name (ID)</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={newField.name}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    placeholder="e.g., document_title"
                  />
                  <small className="form-text text-muted">
                    Used as the field identifier (no spaces)
                  </small>
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Field Type */}
                <div className="form-group">
                  <label>Field Type</label>
                  <select
                    className="form-control"
                    value={newField.type}
                    onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                  >
                    {fieldTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Options (for dropdown) */}
                {newField.type === 'select' && (
                  <div className="form-group">
                    <label className="required-field">Options</label>
                    <input
                      type="text"
                      className={`form-control ${errors.options ? 'is-invalid' : ''}`}
                      value={newField.options}
                      onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                      placeholder="Option 1, Option 2, Option 3"
                    />
                    <small className="form-text text-muted">
                      Separate options with commas
                    </small>
                    {errors.options && (
                      <div className="invalid-feedback">{errors.options}</div>
                    )}
                  </div>
                )}

                {/* Placeholder */}
                <div className="form-group">
                  <label>Placeholder Text</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newField.placeholder}
                    onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                    placeholder="e.g., Enter document title..."
                  />
                </div>

                {/* Required */}
                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="required"
                    checked={newField.required}
                    onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="required">
                    Required Field
                  </label>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    <i className={`fas ${editingId ? 'fa-save' : 'fa-plus'} mr-2`}></i>
                    {editingId ? 'Update Field' : 'Add Field'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-secondary ml-2"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Existing Fields */}
        <div className="col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Existing Fields ({fields.length})
              </h6>
            </div>
            <div className="card-body">
              {fields.length === 0 ? (
                <EmptyState
                  icon="fa-list-alt"
                  title="No Fields Defined"
                  description="Add your first custom field using the form on the left."
                />
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Label</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Required</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((field) => (
                        <tr key={field.id}>
                          <td className="font-weight-bold">{field.label}</td>
                          <td>
                            <code>{field.name}</code>
                          </td>
                          <td>
                            <span className="badge badge-info">
                              {fieldTypes.find((t) => t.value === field.type)?.label || field.type}
                            </span>
                          </td>
                          <td>
                            {field.required ? (
                              <span className="badge badge-success">Yes</span>
                            ) : (
                              <span className="badge badge-secondary">No</span>
                            )}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn btn-sm btn-success btn-icon-sm"
                                onClick={() => handleEditField(field)}
                                title="Edit Field"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger btn-icon-sm"
                                onClick={() => handleDeleteClick(field)}
                                title="Delete Field"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, field: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Field"
        message={
          deleteModal.field
            ? `Are you sure you want to delete the field "${deleteModal.field.label}"? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}

export default DefineFieldsPage;
