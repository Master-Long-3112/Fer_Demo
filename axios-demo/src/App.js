import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./components/HomePage";
import ClassPage from "./components/ClassPage";
import axios from "axios";
import { useEffect } from "react";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedClass, setSelectedClass] = useState(null);
  const [classData, setClassData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:9999/Class")
      .then((response) => {
        setClassData(response.data);
        console.log("Fetched class data:", response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleClassClick = (classCode) => {
    setSelectedClass(classCode);
    setCurrentPage("class");
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
    setSelectedClass(null);
  };

  if (!classData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {currentPage === "home" ? (
        <HomePage classes={classData} onClassClick={handleClassClick} />
      ) : (
        <ClassPage
          classData={classData.find((c) => c.ClassCode === selectedClass)}
          allData={classData}
          onBack={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;
