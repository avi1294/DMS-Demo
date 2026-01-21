import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { departments } from '../../data/seedData';
import LoadingSpinner from '../../components/common/LoadingSpinner';

function EditMemberPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMemberById, updateMember } = useData();
  const toast = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    status: 'active',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const member = getMemberById(id);
    if (member) {
      setFormData({
        firstName: member.firstName || '',
        lastName: member.lastName || '',
        email: member.email || '',
        phone: member.phone || '',
        department: member.department || '',
        role: member.role || '',
        status: member.status || 'active',
      });
      setLoading(false);
    } else {
      setNotFound(true);
      setLoading(false);
    }
  }, [id, getMemberById]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.department) {
      newErrors.department = 'Department is required';
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
      const updatedMember = updateMember(id, formData);

      if (updatedMember) {
        toast.success(`Member "${formData.firstName} ${formData.lastName}" updated successfully`);
        navigate('/members');
      } else {
        toast.error('Failed to update member');
      }
    } catch (error) {
      toast.error('An error occurred while updating the member');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading member..." />;
  }

  if (notFound) {
    return (
      <div className="container-fluid fade-in">
        <div className="text-center py-5">
          <i className="fas fa-user-slash fa-4x text-gray-400 mb-4"></i>
          <h3 className="text-gray-800">Member Not Found</h3>
          <p className="text-gray-600 mb-4">The member you're looking for doesn't exist or has been deleted.</p>
          <Link to="/members" className="btn btn-primary">
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Members
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="h3 mb-0 text-gray-800">Edit Member</h1>
        <Link to="/members" className="btn btn-secondary">
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Members
        </Link>
      </div>

      {/* Form Card */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Edit Member Information
          </h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* First Name */}
              <div className="col-md-6 mb-3">
                <label htmlFor="firstName" className="required-field">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <div className="invalid-feedback">{errors.firstName}</div>
                )}
              </div>

              {/* Last Name */}
              <div className="col-md-6 mb-3">
                <label htmlFor="lastName" className="required-field">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <div className="invalid-feedback">{errors.lastName}</div>
                )}
              </div>

              {/* Email */}
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="required-field">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {/* Phone */}
              <div className="col-md-6 mb-3">
                <label htmlFor="phone" className="required-field">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>

              {/* Department */}
              <div className="col-md-6 mb-3">
                <label htmlFor="department" className="required-field">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <div className="invalid-feedback">{errors.department}</div>
                )}
              </div>

              {/* Role */}
              <div className="col-md-6 mb-3">
                <label htmlFor="role">Role / Position</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  className="form-control"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Enter role or position"
                />
              </div>

              {/* Status */}
              <div className="col-md-6 mb-3">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <hr className="my-4" />
            <div className="d-flex justify-content-end">
              <Link to="/members" className="btn btn-secondary mr-2">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Update Member
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

export default EditMemberPage;
