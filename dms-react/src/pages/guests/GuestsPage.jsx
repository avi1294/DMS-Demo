import { useState, useMemo } from 'react'

function GuestsPage() {
  const [filters, setFilters] = useState({ department: '', year: '', documentType: '', documentNumber: '', subjectTitle: '', dateFrom: '', dateTo: '', status: '' })
  const [showResults, setShowResults] = useState(false)

  const results = useMemo(() => [
    { docNumber: 'ENG/CS/SYL/2024/001', title: 'Computer Science Syllabus 2024', dept: 'Engineering', year: '2024', type: 'Syllabus', date: '15/01/2024', status: 'Active' },
    { docNumber: 'ENG/MATH/EXAM/2024/015', title: 'Final Exam Paper - Fine Arts', dept: 'Arts', year: '2023', type: 'Exam Paper', date: '20/05/2024', status: 'Active' },
    { docNumber: 'ENG/MATH/EXAM/2024/015', title: 'Final Exam Paper - Accounts', dept: 'Commerce', year: '2022', type: 'Notice', date: '20/05/2024', status: 'Active' },
    { docNumber: 'ENG/MATH/EXAM/2024/015', title: 'Final Exam Paper - Mathematics', dept: 'Science', year: '2021', type: 'Report', date: '20/05/2024', status: 'Reject / hold' },
  ], [])

  const handleSearch = (e) => {
    e.preventDefault()
    setShowResults(true)
  }

  const handleClear = () => {
    setFilters({ department: '', year: '', documentType: '', documentNumber: '', subjectTitle: '', dateFrom: '', dateTo: '', status: '' })
    setShowResults(false)
  }

  return (
    <div className="container-fluid my-5">
      <div className="card shadow-sm rounded mb-4">
        <div className="card-body">
          <h3 className="card-title">Search Documents</h3>
          <p className="text-muted">Search and filter documents by department, year, type, and document number</p>
          <form onSubmit={handleSearch}>
            <div className="row">
              <div className="col-md-3 mb-3">
                <label>Department</label>
                <select className="form-control" value={filters.department} onChange={(e) => setFilters({...filters, department: e.target.value})}>
                  <option value="">Select Department</option>
                  <option>Engineering</option><option>Science</option><option>Arts</option><option>Commerce</option><option>Management</option>
                </select>
              </div>
              <div className="col-md-2 mb-3">
                <label>Year</label>
                <input type="text" className="form-control" value={filters.year} onChange={(e) => setFilters({...filters, year: e.target.value})} />
              </div>
              <div className="col-md-3 mb-3">
                <label>Document Type</label>
                <select className="form-control" value={filters.documentType} onChange={(e) => setFilters({...filters, documentType: e.target.value})}>
                  <option value="">Select Document Type</option>
                  <option>Syllabus</option><option>Exam Paper</option><option>Report</option><option>Certificate</option><option>Notice</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label>Document Number</label>
                <input type="text" className="form-control" placeholder="Enter Document Number" value={filters.documentNumber} onChange={(e) => setFilters({...filters, documentNumber: e.target.value})} />
              </div>
              <div className="col-md-4 mb-3">
                <label>Subject/Title</label>
                <input type="text" className="form-control" placeholder="Enter Subject or Title" value={filters.subjectTitle} onChange={(e) => setFilters({...filters, subjectTitle: e.target.value})} />
              </div>
              <div className="col-md-3 mb-3">
                <label>Date From</label>
                <input type="date" className="form-control" value={filters.dateFrom} onChange={(e) => setFilters({...filters, dateFrom: e.target.value})} />
              </div>
              <div className="col-md-3 mb-3">
                <label>Date To</label>
                <input type="date" className="form-control" value={filters.dateTo} onChange={(e) => setFilters({...filters, dateTo: e.target.value})} />
              </div>
              <div className="col-md-2 mb-3">
                <label>Status</label>
                <select className="form-control" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
                  <option>All Status</option><option>Active</option><option>Reject / hold</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <button type="submit" className="btn btn-primary mr-2">Search Documents</button>
              <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear Filters</button>
            </div>
          </form>
        </div>
      </div>

      {showResults && (
        <div className="card shadow-sm rounded">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title mb-0">Search Results</h5>
              <button className="btn btn-success">Download All PDFs</button>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-light">
                  <tr>
                    <th>Document Number</th><th>Title</th><th>Department</th><th>Year</th><th>Type</th><th>Date</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, idx) => (
                    <tr key={idx}>
                      <td><strong>{row.docNumber}</strong></td>
                      <td>{row.title}</td>
                      <td>{row.dept}</td>
                      <td>{row.year}</td>
                      <td><span className="badge bg-primary text-white">{row.type}</span></td>
                      <td>{row.date}</td>
                      <td><span className={`badge ${row.status === 'Active' ? 'bg-success' : 'bg-danger'} text-white`}>{row.status}</span></td>
                      <td>
                        <button className="btn btn-sm btn-success mr-1"><i className="fas fa-eye"></i> View</button>
                        <button className="btn btn-sm btn-primary"><i className="fas fa-download"></i> Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GuestsPage
