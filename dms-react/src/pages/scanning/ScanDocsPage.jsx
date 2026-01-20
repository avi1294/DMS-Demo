import { useState, useMemo } from 'react'
import DataTable from '../../components/tables/DataTable'
import Modal from '../../components/common/Modal'

function ScanDocsPage() {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [filters, setFilters] = useState({ dept: '', area: '', year: '' })

  const data = useMemo(() => [
    { dept: 'HR', area: 'Edinburgh', year: '2011/04/25', fileNo: '320,800' },
    { dept: 'IT', area: 'Tokyo', year: '2011/07/25', fileNo: '170,750' },
    { dept: 'Finance', area: 'San Francisco', year: '2009/01/12', fileNo: '86,000' },
    { dept: 'HR', area: 'Edinburgh', year: '2012/03/29', fileNo: '433,060' },
    { dept: 'IT', area: 'Tokyo', year: '2008/11/28', fileNo: '162,700' },
  ], [])

  const filteredData = useMemo(() => {
    return data.filter(row => {
      if (filters.dept && !row.dept.toLowerCase().includes(filters.dept.toLowerCase())) return false
      if (filters.area && !row.area.toLowerCase().includes(filters.area.toLowerCase())) return false
      if (filters.year && !row.year.includes(filters.year)) return false
      return true
    })
  }, [data, filters])

  const columns = useMemo(() => [
    { header: 'Dept Name', accessorKey: 'dept' },
    { header: 'Area', accessorKey: 'area' },
    { header: 'Year', accessorKey: 'year' },
    { header: 'File No', accessorKey: 'fileNo' },
    {
      header: 'Actions',
      cell: () => (
        <>
          <button className="btn btn-sm btn-outline-success mr-1" onClick={() => setShowUploadModal(true)} title="Upload Files">
            <i className="fas fa-upload"></i>
          </button>
          <button className="btn btn-sm btn-outline-danger" title="Reject or hold">
            <i className="fas fa-trash"></i>
          </button>
        </>
      )
    }
  ], [])

  const handleUpload = () => {
    alert('Documents Uploaded Successfully')
    setShowUploadModal(false)
    setSelectedFile(null)
  }

  return (
    <div className="container-fluid">
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Upload Scan Documents</h6>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3">
              <label>Filter by Dept:</label>
              <select className="form-control" value={filters.dept} onChange={(e) => setFilters({...filters, dept: e.target.value})}>
                <option value="">All</option>
                <option value="HR">HR</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div className="col-md-3">
              <label>Filter by Area:</label>
              <select className="form-control" value={filters.area} onChange={(e) => setFilters({...filters, area: e.target.value})}>
                <option value="">All</option>
                <option value="Edinburgh">Edinburgh</option>
                <option value="Tokyo">Tokyo</option>
                <option value="San Francisco">San Francisco</option>
              </select>
            </div>
            <div className="col-md-3">
              <label>Filter by Year:</label>
              <select className="form-control" value={filters.year} onChange={(e) => setFilters({...filters, year: e.target.value})}>
                <option value="">All</option>
                <option value="2009">2009</option>
                <option value="2010">2010</option>
                <option value="2011">2011</option>
                <option value="2012">2012</option>
              </select>
            </div>
          </div>
          <DataTable data={filteredData} columns={columns} searchable={false} />
        </div>
      </div>

      <Modal show={showUploadModal} title="Upload Documents" onClose={() => setShowUploadModal(false)}
        footer={<><button className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleUpload}>Upload</button></>}>
        <div className="text-center">
          <label htmlFor="uploadDocs" className="btn btn-outline-success" style={{ cursor: 'pointer', padding: '20px', border: '2px dashed #4CAF50', width: '80%' }}>
            <i className="fas fa-cloud-upload-alt"></i> Click to select file
          </label>
          <input type="file" id="uploadDocs" style={{ display: 'none' }} onChange={(e) => setSelectedFile(e.target.files[0])} />
          <div className="mt-2 text-muted">{selectedFile ? selectedFile.name : 'No file chosen'}</div>
        </div>
      </Modal>
    </div>
  )
}

export default ScanDocsPage
