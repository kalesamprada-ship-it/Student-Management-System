import { useEffect, useState } from 'react'
import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from './api'
import './App.css'

const empty = { name: '', email: '', course: '', year: 1 }

export default function App() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const load = () =>
    getStudents()
      .then(setStudents)
      .catch((e) => setError(e.message))

  useEffect(() => {
    load()
  }, [])

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = { ...form, year: Number(form.year) }
    try {
      if (editingId) await updateStudent(editingId, payload)
      else await createStudent(payload)
      setForm(empty)
      setEditingId(null)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const onEdit = (s) => {
    setEditingId(s.id)
    setForm({ name: s.name, email: s.email, course: s.course, year: s.year })
  }

  const onDelete = async (id) => {
    await deleteStudent(id)
    load()
  }

  return (
    <main className="container">
      <h1>Student Management</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={onSubmit} className="form">
        <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input name="course" placeholder="Course" value={form.course} onChange={onChange} required />
        <input name="year" type="number" min="1" max="6" value={form.year} onChange={onChange} required />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm(empty) }}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Course</th><th>Year</th><th></th></tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td><td>{s.name}</td><td>{s.email}</td><td>{s.course}</td><td>{s.year}</td>
              <td>
                <button onClick={() => onEdit(s)}>Edit</button>{' '}
                <button onClick={() => onDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr><td colSpan="6">No students yet.</td></tr>
          )}
        </tbody>
      </table>
    </main>
  )
}
