import React, { useState, useEffect } from "react";
import ExamResultModal from "./ExamResultModal";
import axios from "axios";

const StudentTable = ({ classCode }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formActions, setFormActions] = useState("add");
  const [formData, setFormData] = useState({
    StudentID: "",
    FirstName: "",
    LastName: "",
    Email: "",
    PhoneNumber: "",
    ClassCode: classCode || "",
  });
  const [reload, setReload] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:9999/Student?ClassCode=${classCode}`)
      .then((response) => {
        setStudents(response.data);
      });

    setReload(false);
  }, [classCode, reload]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewExamResults = (student) => {
    setSelectedStudent(student);
    setShowExamModal(true);
  };

  const handleCloseExamModal = () => {
    setShowExamModal(false);
    setSelectedStudent(null);
  };

  const handleAdd = () => {
    setFormActions("add");
    setFormData({
      StudentID: "",
      FirstName: "",
      LastName: "",
      Email: "",
      PhoneNumber: "",
      ClassCode: classCode || "",
    });
    setShowForm(true);
  };

  const handleUpdate = (student) => {
    setFormActions("update");
    setFormData({
      StudentID: student.StudentID,
      FirstName: student.FirstName,
      LastName: student.LastName,
      Email: student.Email,
      PhoneNumber: student.PhoneNumber,
      ClassCode: student.ClassCode,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formActions === "add") {
      try {
        await axios.post("http://localhost:9999/Student", formData);
        alert(`Student ${formData.StudentID} added successfully!`);
        setReload(true);
      } catch (error) {
        console.error("Error adding student:", error);
        alert("Failed to add student!");
      }
    } else if (formActions === "update") {
      try {
        const student = students.find(
          (s) => s.StudentID === formData.StudentID
        );
        await axios.patch(
          `http://localhost:9999/Student/${student.id}`,
          formData
        );
        alert(`Student ${formData.StudentID} updated successfully!`);
        setReload(true);
      } catch (error) {
        console.error("Error updating student:", error);
        alert("Failed to update student!");
      }
    }

    setFormData({
      StudentID: "",
      FirstName: "",
      LastName: "",
      Email: "",
      PhoneNumber: "",
      ClassCode: classCode || "",
    });
    setShowForm(false);
  };

  const handleDelete = (student) => {
    axios
      .delete(`http://localhost:9999/Student/${student.id}`)
      .then(() => {
        alert(`Deleted student ${student.StudentID}`);
        setReload(true);
      })
      .catch((error) => {
        console.error("Error deleting student:", error);
        alert("Failed to delete student!");
      });
  };

  if (students.length === 0) {
    return <div>No students found for this class.</div>;
  }
  return (
    <>
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="bi bi-people"></i> Students Information
          </h4>
          {!showForm ? (
            <button className="btn btn-light btn-sm" onClick={handleAdd}>
              <i className="bi bi-plus-circle"></i> Add Student
            </button>
          ) : (
            <button
              className="btn btn-light btn-sm"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="card-body bg-light border-bottom">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Student ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="StudentID"
                    value={formData.StudentID}
                    onChange={handleChange}
                    required
                    readOnly={formActions === "update"}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="number"
                    className="form-control"
                    name="PhoneNumber"
                    value={formData.PhoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Class Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ClassCode"
                    value={formData.ClassCode}
                    onChange={handleChange}
                    required
                    readOnly={formActions === "add"}
                  />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-success">
                    Confirm changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Student ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th style={{ width: "200px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.StudentID}>
                    <td>
                      <span className="badge bg-success">
                        {student.StudentID}
                      </span>
                    </td>
                    <td>{student.FirstName}</td>
                    <td>{student.LastName}</td>
                    <td>
                      <a
                        href={`mailto:${student.Email}`}
                        className="text-decoration-none"
                      >
                        <i className="bi bi-envelope"></i> {student.Email}
                      </a>
                    </td>
                    <td>
                      <i className="bi bi-telephone"></i> {student.PhoneNumber}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-1"
                        onClick={() => handleViewExamResults(student)}
                        title="View Exam Results"
                      >
                        <i className="bi bi-file-text">View Exam Result</i>
                      </button>
                      <button
                        className="btn btn-sm btn-primary me-1"
                        onClick={() => handleUpdate(student)}
                        title="Update"
                      >
                        Update<i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(student)}
                        title="Delete"
                      >
                        Delete<i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showExamModal && selectedStudent && (
        <ExamResultModal
          student={selectedStudent}
          show={showExamModal}
          onClose={handleCloseExamModal}
        />
      )}
    </>
  );
};

export default StudentTable;
