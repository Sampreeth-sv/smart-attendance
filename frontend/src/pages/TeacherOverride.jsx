import { useState, useEffect } from "react";

function TeacherOverride({ teacher, onClose }) {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Subjects mapped by teacher USN (same as dashboard)
  const subjectsByTeacher = {
    T001: [
      "Software Engineering and Project Management",
      "Computer Networks",
      "Theory of Computation"
    ],
    T002: [
      "Web Technology Lab",
      "Artificial Intelligence",
      "Research Methodology and IPR"
    ]
  };

  const teacherSubjects = subjectsByTeacher[teacher.usn] || [];

  // ✅ Fetch student list (for now all students, later can filter)
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost:5000/attendance/students");
        const data = await res.json();
        setStudents(data.students || []);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    fetchStudents();
  }, []);

  // ✅ Select/Deselect student
  const handleCheckbox = (usn) => {
    setSelected((prev) =>
      prev.includes(usn) ? prev.filter((id) => id !== usn) : [...prev, usn]
    );
  };

  // ✅ Manual override submission
  const handleOverride = async () => {
    if (!subject || selected.length === 0) {
      alert("⚠️ Please select at least one student and a subject!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/teacher/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacher_name: teacher.name,
          subject: subject,
          usns: selected
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Attendance overridden for: ${data.marked.join(", ")}`);
        setSelected([]);
      } else {
        alert("❌ Error overriding attendance: " + data.detail);
      }
    } catch (err) {
      alert("Error connecting to server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="override-modal"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}
    >
      <div
        className="card"
        style={{
          backgroundColor: "white",
          padding: "20px",
          width: "90%",
          maxWidth: "600px",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
        }}
      >
        <h3>✏️ Manual Attendance Override</h3>
        <p>Teacher: <strong>{teacher.name}</strong></p>

        <label>Select Subject:</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "5px",
            borderRadius: "5px"
          }}
        >
          <option value="">-- Choose Subject --</option>
          {teacherSubjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <h4>Student List</h4>
        <div
          className="student-list"
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px"
          }}
        >
          {students.length === 0 ? (
            <p>Loading students...</p>
          ) : (
            students.map((s) => (
              <div
                key={s.usn}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "6px"
                }}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(s.usn)}
                  onChange={() => handleCheckbox(s.usn)}
                  style={{ marginRight: "10px" }}
                />
                <span>{s.name} ({s.usn})</span>
              </div>
            ))
          )}
        </div>

        <div
          className="actions"
          style={{
            marginTop: "15px",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <button
            onClick={handleOverride}
            disabled={loading}
            className="btn-success"
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#28a745",
              color: "white"
            }}
          >
            {loading ? "Marking..." : "✅ Mark Selected Present"}
          </button>
          <button
            onClick={onClose}
            className="btn-danger"
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#dc3545",
              color: "white"
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherOverride;
