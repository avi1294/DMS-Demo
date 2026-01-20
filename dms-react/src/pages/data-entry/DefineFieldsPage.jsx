import { useState } from 'react'

function DefineFieldsPage() {
  const [fields, setFields] = useState([
    { id: 1, name: 'Department', type: 'text', required: true },
    { id: 2, name: 'Year', type: 'number', required: true },
    { id: 3, name: 'Area', type: 'text', required: false },
  ])

  const [newField, setNewField] = useState({ name: '', type: 'text', required: false })

  const handleAddField = (e) => {
    e.preventDefault()
    if (newField.name) {
      setFields([...fields, { ...newField, id: Date.now() }])
      setNewField({ name: '', type: 'text', required: false })
    }
  }

  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-start mb-4">
        <h1 className="h3 mb-0 text-gray-800">Define Fields</h1>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Add New Field</h6>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddField}>
                <div className="form-group">
                  <label>Field Name</label>
                  <input type="text" className="form-control" value={newField.name} onChange={(e) => setNewField({...newField, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Field Type</label>
                  <select className="form-control" value={newField.type} onChange={(e) => setNewField({...newField, type: e.target.value})}>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="select">Dropdown</option>
                  </select>
                </div>
                <div className="form-group form-check">
                  <input type="checkbox" className="form-check-input" checked={newField.required} onChange={(e) => setNewField({...newField, required: e.target.checked})} />
                  <label className="form-check-label">Required</label>
                </div>
                <button type="submit" className="btn btn-primary">Add Field</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Existing Fields</h6>
            </div>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Required</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map(field => (
                    <tr key={field.id}>
                      <td>{field.name}</td>
                      <td>{field.type}</td>
                      <td>{field.required ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DefineFieldsPage
