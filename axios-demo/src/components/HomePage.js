import React, { useState } from "react";

const HomePage = ({ classes, onClassClick }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ClassCode: "",
    RoomNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New class data:", formData);
    alert(`Class ${formData.ClassCode} added successfully!`);
    setFormData({ ClassCode: "", RoomNo: "" });
    setShowForm(false);
  };

  const handleUpdate = (classItem) => {
    console.log("Update class:", classItem);
    alert(`Update class ${classItem.ClassCode}`);
  };

  const handleDelete = (classItem, e) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete class ${classItem.ClassCode}?`
      )
    ) {
      console.log("Delete class:", classItem);
      alert(`Deleted class ${classItem.ClassCode}`);
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">School Management System</h1>
        <p className="lead text-muted">Select a class to view details</p>
      </div>

      {/* Add Button */}
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-success"
          onClick={() => setShowForm(!showForm)}
        >
          <i className="bi bi-plus-circle"></i>{" "}
          {showForm ? "Cancel" : "Add New Class"}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card mb-4 border-success">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">Add New Class</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Class Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ClassCode"
                    value={formData.ClassCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Room Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="RoomNo"
                    value={formData.RoomNo}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mt-3">
                <button type="submit" className="btn btn-success">
                  Add Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="row g-4">
        {classes.map((classItem) => (
          <div key={classItem.ClassCode} className="col-md-4">
            <div
              className="card shadow-sm h-100 hover-card"
              style={{ cursor: "pointer" }}
              onClick={() => onClassClick(classItem.ClassCode)}
            >
              <div className="card-body text-center">
                <div className="mb-3">
                  <i
                    className="bi bi-door-open"
                    style={{ fontSize: "3rem", color: "#0d6efd" }}
                  ></i>
                </div>
                <h3 className="card-title">{classItem.ClassCode}</h3>
                <p className="card-text text-muted">
                  <strong>Room:</strong> {classItem.RoomNo}
                </p>
                <div className="d-flex justify-content-center gap-2 mt-3">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onClassClick(classItem.ClassCode)}
                  >
                    <i className="bi bi-eye"></i> View
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate(classItem);
                    }}
                  >
                    <i className="bi bi-pencil-square"></i> Update
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => handleDelete(classItem, e)}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
