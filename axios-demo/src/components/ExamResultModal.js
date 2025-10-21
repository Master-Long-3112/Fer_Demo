import React, { useState, useEffect } from "react";
import axios from "axios";

const ExamResultModal = ({ student, show, onClose }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ExamResultID: "",
    StudentID: student?.StudentID || "",
    SubjectCode: "",
    Mark: "",
    Comment: "",
  });
  const [examResults, setExamResults] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [reload, setReload] = useState(false);
  const [formAction, setFormAction] = useState("add");

  useEffect(() => {
    axios.get("http://localhost:9999/Subject").then((response) => {
      setSubjects(response.data);
    });
    axios
      .get(`http://localhost:9999/ExamResult?StudentID=${student.StudentID}`)
      .then((response) => {
        setExamResults(response.data);
      });
    setReload(false);
  }, [student, reload]);
  // Fetch exam results for the student

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formAction === "add") {
      await axios.post("http://localhost:9999/ExamResult", formData);
      setReload(true);
    } else if (formAction === "update") {
      let result = examResults.find(
        (e) => e.ExamResultID === formData.ExamResultID
      );
      await axios.put(
        `http://localhost:9999/ExamResult/${result.id}`,
        formData
      );
      setReload(true);
    }
    setShowForm(false);
  };

  const handleUpdate = (examResult) => {
    setFormAction("update");
    setFormData(examResult);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormAction("add");
    setFormData({
      ExamResultID: "",
      StudentID: student?.StudentID || "",
      SubjectCode: "",
      Mark: "",
      Comment: "",
    });
    setShowForm(true);
  };

  const handleDelete = (result) => {
    axios.delete(`http://localhost:9999/ExamResult/${result.id}`).then(() => {
      alert(`Exam result ${result.id} deleted successfully!`);
      setReload(true);
    });
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header bg-warning">
            <h5 className="modal-title">
              <i className="bi bi-file-text"></i> Exam Results -{" "}
              {student.FirstName} {student.LastName} ({student.StudentID})
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Add Button */}
            <div className="d-flex justify-content-end mb-3">
              {!showForm ? (
                <button className="btn btn-success" onClick={() => handleAdd()}>
                  <i className="bi bi-plus-circle"></i> Add New Exam Result
                </button>
              ) : (
                <button
                  className="btn btn-danger"
                  onClick={() => setShowForm(!showForm)}
                >
                  <i className="bi bi-x-circle"></i> Cancel
                </button>
              )}
            </div>

            {/* Add Form */}
            {showForm && (
              <div className="card mb-3 border-success">
                <div className="card-body bg-light">
                  <h5 className="mb-3">Add New Exam Result</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-3">
                        <label className="form-label">Exam Result ID</label>
                        <input
                          type="number"
                          className="form-control"
                          name="ExamResultID"
                          value={formData.ExamResultID}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Student ID</label>
                        <input
                          type="text"
                          className="form-control"
                          name="StudentID"
                          value={formData.StudentID}
                          readOnly
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Subject</label>
                        <select
                          className="form-select"
                          name="SubjectCode"
                          value={formData.SubjectCode}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Subject</option>
                          {subjects.map((subject) => (
                            <option
                              key={subject.SubjectCode}
                              value={subject.SubjectCode}
                            >
                              {subject.SubjectName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Mark</label>
                        <input
                          type="number"
                          className="form-control"
                          name="Mark"
                          value={formData.Mark}
                          onChange={handleChange}
                          required
                          min="0"
                          max="100"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Comment</label>
                        <input
                          type="text"
                          className="form-control"
                          name="Comment"
                          value={formData.Comment}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-12">
                        <button type="submit" className="btn btn-success">
                          Add Exam Result
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Exam Results Table */}
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Exam ID</th>
                    <th>Subject Code</th>
                    <th>Subject Name</th>
                    <th>Mark</th>
                    <th>Comment</th>
                    <th style={{ width: "150px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {examResults.length > 0 ? (
                    examResults.map((result) => (
                      <tr key={result.ExamResultID}>
                        <td>{result.ExamResultID}</td>
                        <td>
                          <span className="badge bg-info">
                            {result.SubjectCode}
                          </span>
                        </td>
                        <td>
                          {subjects.find(
                            (e) => e.SubjectCode === result.SubjectCode
                          )?.SubjectName || "N/A"}
                        </td>
                        <td>
                          <span className="badge bg-primary fs-6">
                            {result.Mark}
                          </span>
                        </td>
                        <td>{result.Comment}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary me-1"
                            onClick={() => handleUpdate(result)}
                            title="Update"
                          >
                            <i className="bi bi-pencil-square">Update</i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(result)}
                            title="Delete"
                          >
                            <i className="bi bi-trash">Delete</i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No exam results found for this student.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResultModal;
