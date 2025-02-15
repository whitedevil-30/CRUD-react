import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
    const [students, setStudents] = useState([]);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [editingId, setEditingId] = useState(null);

    // Fetch Students
    useEffect(() => {
        axios.get("http://localhost:5000/students")
            .then(response => setStudents(response.data))
            .catch(error => console.error(error));
    }, []);

    // Add or Update Student
    const handleSubmit = (e) => {
        e.preventDefault();
        const studentData = { name, age: Number(age) };

        if (editingId) {
            axios.put(`http://localhost:5000/students/${editingId}`, studentData)
                .then(response => {
                    setStudents(students.map(student => student._id === editingId ? response.data : student));
                    setEditingId(null);
                    setName("");
                    setAge("");
                });
        } else {
            axios.post("http://localhost:5000/students", studentData)
                .then(response => setStudents([...students, response.data]));
        }

        setName("");
        setAge("");
    };

    // Edit Student
    const handleEdit = (id) => {
        const student = students.find(student => student._id === id);
        setEditingId(id);
        setName(student.name);
        setAge(student.age);
    };

    // Delete Student
    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/students/${id}`)
            .then(() => setStudents(students.filter(student => student._id !== id)));
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h1>Student Management</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Student Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Student Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                />
                <button type="submit">{editingId ? "Update Student" : "Add Student"}</button>
            </form>

            <ul>
                {students.map(student => (
                    <li key={student._id}>
                        <span>{student.name} - Age {student.age}</span>
                        <button onClick={() => handleEdit(student._id)}>Edit</button>
                        <button onClick={() => handleDelete(student._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
