import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherTable = ({ classCode }) => {
  const [showForm, setShowForm] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    TeacherID: "",
    FirstName: "",
    LastName: "",
    Email: "",
    PhoneNumber: "",
    Subjects: [],
  });
  const [formAction, setFormAction] = useState("add");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:9999/Teacher?ClassCode=${classCode}`)
      .then((response) => {
        setTeachers(response.data);
        console.log("Fetched teachers:", response.data);
        console.log("For class code:", classCode);
      });
    setReload(false);
  }, [classCode, reload]);

  // Fetch all available subjects
  useEffect(() => {
    axios
      .get("http://localhost:9999/Subject")
      .then((response) => {
        setSubjects(response.data);
        console.log("Fetched subjects:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubjectChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      Subjects: checked
        ? [...prev.Subjects, value]
        : prev.Subjects.filter((subject) => subject !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formAction === "add") {
      try {
        await axios.post("http://localhost:9999/Teacher", formData);
        alert(`Teacher ${formData.TeacherID} added successfully!`);
        setReload(true);
        setShowForm(false);
        setFormData({
          TeacherID: "",
          FirstName: "",
          LastName: "",
          Email: "",
          PhoneNumber: "",
          Subjects: [],
        });
      } catch (error) {
        console.error("Error adding teacher:", error);
        alert("Failed to add teacher!");
      }
    } else if (formAction === "update") {
      try {
        const teacher = teachers.find(
          (t) => t.TeacherID === formData.TeacherID
        );
        await axios.patch(
          `http://localhost:9999/Teacher/${teacher.id}`,
          formData
        );
        alert(`Teacher ${formData.TeacherID} updated successfully!`);
        setReload(true);
        setShowForm(false);
        setFormData({
          TeacherID: "",
          FirstName: "",
          LastName: "",
          Email: "",
          PhoneNumber: "",
          Subjects: [],
        });
      } catch (error) {
        console.error("Error updating teacher:", error);
        alert("Failed to update teacher!");
      }
    }
  };

  const handleAdd = () => {
    setFormAction("add");
    setFormData({
      TeacherID: "",
      FirstName: "",
      LastName: "",
      Email: "",
      PhoneNumber: "",
      Subjects: [],
    });
    setShowForm(true);
  };

  const handleUpdate = (teacher) => {
    setFormAction("update");
    setFormData({
      TeacherID: teacher.TeacherID,
      FirstName: teacher.FirstName,
      LastName: teacher.LastName,
      Email: teacher.Email,
      PhoneNumber: teacher.PhoneNumber,
      Subjects: teacher.Subjects || [],
    });
    setShowForm(true);
  };

  const handleDelete = (teacher) => {
    if (
      window.confirm(
        `Are you sure you want to delete teacher ${teacher.FirstName} ${teacher.LastName}?`
      )
    ) {
      axios
        .delete(`http://localhost:9999/Teacher/${teacher.id}`)
        .then(() => {
          alert(`Deleted teacher ${teacher.TeacherID}`);
          setReload(true);
        })
        .catch((error) => {
          console.error("Error deleting teacher:", error);
          alert("Failed to delete teacher!");
        });
    }
  };

  if (teachers.length === 0) {
    return (
      <div className="alert alert-info m-3">
        No teachers assigned to this class.
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h4 className="mb-0">
          <i className="bi bi-person-badge"></i> Teachers Information
        </h4>
        {!showForm ? (
          <button className="btn btn-light btn-sm" onClick={handleAdd}>
            <i className="bi bi-plus-circle"></i> Add Teacher
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

      {/* Add/Update Form */}
      {showForm && (
        <div className="card-body bg-light border-bottom">
          <h5 className="mb-3">
            {formAction === "add" ? "Add New Teacher" : "Update Teacher"}
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Teacher ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="TeacherID"
                  value={formData.TeacherID}
                  onChange={handleChange}
                  required
                  readOnly={formAction === "update"}
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
              <div className="col-md-6">
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
              <div className="col-md-6">
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

              {/* Subjects Checkboxes */}
              <div className="col-12">
                <label className="form-label fw-bold">
                  Subjects{" "}
                  <span className="text-muted">(Select at least one)</span>
                </label>
                <div className="border rounded p-3 bg-white">
                  <div className="row">
                    {subjects.map((subject) => (
                      <div
                        key={subject.SubjectCode}
                        className="col-md-4 col-sm-6 mb-2"
                      >
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={subject.SubjectCode}
                            id={`subject-${subject.SubjectCode}`}
                            checked={formData.Subjects.includes(
                              subject.SubjectCode
                            )}
                            onChange={handleSubjectChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`subject-${subject.SubjectCode}`}
                          >
                            {subject.SubjectName}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-success">
                  {formAction === "add" ? "Add Teacher" : "Update Teacher"}
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
                <th>Teacher ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Subjects Taught</th>
                <th style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => {
                return (
                  <tr key={teacher.TeacherID}>
                    <td>
                      <span className="badge bg-primary">
                        {teacher.TeacherID}
                      </span>
                    </td>
                    <td>{teacher.FirstName}</td>
                    <td>{teacher.LastName}</td>
                    <td>
                      <a
                        href={`mailto:${teacher.Email}`}
                        className="text-decoration-none"
                      >
                        <i className="bi bi-envelope"></i> {teacher.Email}
                      </a>
                    </td>
                    <td>
                      <i className="bi bi-telephone"></i> {teacher.PhoneNumber}
                    </td>
                    <td>
                      {teacher.Subjects && teacher.Subjects.length > 0 ? (
                        teacher.Subjects.map((subjectCode) => {
                          const subject = subjects.find(
                            (s) => s.SubjectCode === subjectCode
                          );
                          return (
                            <span
                              key={subjectCode}
                              className="badge bg-info text-dark me-1 mb-1"
                            >
                              {subject ? subject.SubjectName : subjectCode}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-muted">No subjects</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-1"
                        onClick={() => handleUpdate(teacher)}
                        title="Update"
                      >
                        <i className="bi bi-pencil-square">Update</i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(teacher)}
                        title="Delete"
                      >
                        <i className="bi bi-trash">Delete</i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherTable;
