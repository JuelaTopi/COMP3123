import { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function StudentInfo({ student }) {
  return (
    <>
      <h3>{student.id}</h3>
      <h4>{student.name}</h4>
      <h5>{student.college}</h5>
    </>
  );
}

function App() {
  const [student] = useState({
    id: '101087887',
    name: 'Juela Topi',
    college: 'George Brown College, Toronto',
  });

  return (
    <main className="App">
      <img src={logo} className="App-logo" alt="React logo" />
      <h1>Welcome to Fullstack Development - I</h1>
      <h2>React JS Programming Week09 Lab exercise</h2>
      <StudentInfo student={student} />
    </main>
  );
}

export default App;