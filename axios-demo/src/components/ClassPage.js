import React, { useState, useEffect } from "react";
import TeacherTable from "./TeacherTable";
import StudentTable from "./StudentTable.js";
import axios from "axios";

const ClassPage = ({ classData, onBack }) => {
  const [viewMode, setViewMode] = useState(null);
  const [classTeachers, setClassTeachers] = useState(null);
  const [classStudents, setClassStudents] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:9999/Teacher?ClassCode=${classData.ClassCode}`)
      .then((response) => {
        setClassTeachers(response.data);
      });
    axios
      .get(`http://localhost:9999/Student?ClassCode=${classData.ClassCode}`)
      .then((response) => {
        setClassStudents(response.data);
      });
  }, [classData]);

  if (!classData || !classTeachers || !classStudents) {
    return (
      <div>
        <div>Loading ...</div>
        <button className="btn btn-outline-secondary mb-3" onClick={onBack}>
          <i className="bi bi-arrow-left"></i> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <button className="btn btn-outline-secondary mb-3" onClick={onBack}>
            <i className="bi bi-arrow-left"></i> Back to Home
          </button>

          <div className="row">
            <div className="col-md-8">
              <h1 className="display-5 mb-3">Class {classData.ClassCode}</h1>
              <div className="row">
                <div className="col-md-4">
                  <p className="mb-2">
                    <strong>
                      <i className="bi bi-door-closed"></i> Room Number:
                    </strong>
                    <span className="badge bg-primary ms-2">
                      {classData.RoomNo}
                    </span>
                  </p>
                </div>
                <div className="col-md-4">
                  <p className="mb-2">
                    <strong>
                      <i className="bi bi-people"></i> Total Students:
                    </strong>
                    <span className="badge bg-success ms-2">
                      {classStudents.length}
                    </span>
                  </p>
                </div>
                <div className="col-md-4">
                  <p className="mb-2">
                    <strong>
                      <i className="bi bi-person-badge"></i> Total Teachers:
                    </strong>
                    <span className="badge bg-info ms-2">
                      {classTeachers.length}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 d-flex align-items-center justify-content-end">
              <div className="btn-group" role="group">
                <button
                  className={`btn ${
                    viewMode === "teachers"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setViewMode("teachers")}
                >
                  <i className="bi bi-person-badge"></i> View Teachers
                </button>
                <button
                  className={`btn ${
                    viewMode === "students"
                      ? "btn-success"
                      : "btn-outline-success"
                  }`}
                  onClick={() => setViewMode("students")}
                >
                  <i className="bi bi-people"></i> View Students
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === null && (
        <div className="text-center mt-5">
          <i
            className="bi bi-arrow-up-circle"
            style={{ fontSize: "4rem", color: "#6c757d" }}
          ></i>
          <h4 className="text-muted mt-3">
            Please select an option above to view data
          </h4>
        </div>
      )}

      {viewMode === "teachers" && (
        <TeacherTable classCode={classData.ClassCode} />
      )}

      {viewMode === "students" && (
        <StudentTable classCode={classData.ClassCode} />
      )}
    </div>
  );
};

export default ClassPage;
