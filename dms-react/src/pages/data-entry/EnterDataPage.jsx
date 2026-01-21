import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { documentTypes, documentCategories } from '../../data/seedData';

function EnterDataPage() {
  const navigate = useNavigate();
  const { addDocument, members } = useData();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    type: '',
    category: '',
    memberId: '',
    notes: '',
    pageCount: '',
    priority: 'medium',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const activeMembers = members.filter((m) => m.status === 'active');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Document title is required';
    }
    if (!formData.type) {
      newErrors.type = 'Document type is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.warning('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const selectedMember = members.find((m) => m.id === formData.memberId);

      const newDoc = addDocument({
        ...formData,
        memberName: selectedMember
          ? `${selectedMember.firstName} ${selectedMember.lastName}`
          : '',
        pageCount: formData.pageCount ? parseInt(formData.pageCount) : 0,
        status: 'pending',
      });

      if (newDoc) {
        toast.success(`Document "${formData.title}" added successfully`);
        navigate('/data-entry/view');
      } else {
        toast.error('Failed to add document');
      }
    } catch (error) {
      toast.error('An error occurred while adding the document');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="h3 mb-0 text-gray-800">Enter Data</h1>
        <Link to="/data-entry/view" className="btn btn-secondary">
          <i className="fas fa-list mr-2"></i>
          View Documents
        </Link>
      </div>

      {/* Form Card */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Add New Document</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Document Title */}
              <div className="col-md-12 mb-3">
                <label htmlFor="title" className="required-field">
                  Document Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter document title"
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              {/* Document Type */}
              <div className="col-md-6 mb-3">
                <label htmlFor="type" className="required-field">
                  Document Type
                </label>
                <select
                  id="type"
                  name="type"
                  className={`form-control ${errors.type ? 'is-invalid' : ''}`}
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.type && <div className="invalid-feedback">{errors.type}</div>}
              </div>

              {/* Category */}
              <div className="col-md-6 mb-3">
                <label htmlFor="category" className="required-field">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {documentCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="invalid-feedback">{errors.category}</div>
                )}
              </div>

              {/* Assigned To */}
              <div className="col-md-6 mb-3">
                <label htmlFor="memberId">Assigned To</label>
                <select
                  id="memberId"
                  name="memberId"
                  className="form-control"
                  value={formData.memberId}
                  onChange={handleChange}
                >
                  <option value="">Select Member (Optional)</option>
                  {activeMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName} - {member.department}
                    </option>
                  ))}
                </select>
              </div>

              {/* Page Count */}
              <div className="col-md-3 mb-3">
                <label htmlFor="pageCount">Page Count</label>
                <input
                  type="number"
                  id="pageCount"
                  name="pageCount"
                  className="form-control"
                  value={formData.pageCount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Priority */}
              <div className="col-md-3 mb-3">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  className="form-control"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Notes */}
              <div className="col-md-12 mb-3">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  className="form-control"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any additional notes..."
                  rows="3"
                />
              </div>
            </div>

            {/* Form Actions */}
            <hr className="my-4" />
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-secondary mr-2"
                onClick={() => setFormData({
                  title: '',
                  type: '',
                  category: '',
                  memberId: '',
                  notes: '',
                  pageCount: '',
                  priority: 'medium',
                })}
              >
                Clear Form
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Save Document
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EnterDataPage;
