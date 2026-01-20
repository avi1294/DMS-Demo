import { useState } from 'react'
import { generateYearOptions } from '../../utils/formatters'

function EnterDataPage() {
  const [formData, setFormData] = useState({
    deptName: 'Health',
    year: '',
    area: '',
    fileNo: ''
  })

  const years = generateYearOptions()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Data added Successfully')
  }

  return (
    <div className="container">
      <div className="d-sm-flex align-items-center justify-content-center mb-4">
        <h1 className="h3 mb-0 text-gray-800">Enter Data</h1>
      </div>

      <div className="container px-4">
        <div className="card mt-4 shadow">
          <div className="card-header d-flex justify-content-between">
            <h4 className="mb-0">Add Data</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Dept</label>
                  <select name="deptName" className="form-control" value={formData.deptName} onChange={handleChange}>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Finance">Finance</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label>Year</label>
                  <select name="year" className="form-control" value={formData.year} onChange={handleChange}>
                    <option value="" disabled>Select Year</option>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label>Area</label>
                  <input type="text" name="area" className="form-control" value={formData.area} onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label>File No.</label>
                  <input type="text" name="fileNo" className="form-control" value={formData.fileNo} onChange={handleChange} />
                </div>
                <div className="col-md-12 mb-3 text-center">
                  <br />
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnterDataPage
