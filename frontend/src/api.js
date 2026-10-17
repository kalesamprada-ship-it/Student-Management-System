async function request(url, options) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err.detail === 'string' ? err.detail : 'Request failed',
    )
  }
  return res.status === 204 ? null : res.json()
}

export const getStudents = () => request('/api/students')
export const createStudent = (s) =>
  request('/api/students', { method: 'POST', body: JSON.stringify(s) })
export const updateStudent = (id, s) =>
  request(`/api/students/${id}`, { method: 'PUT', body: JSON.stringify(s) })
export const deleteStudent = (id) =>
  request(`/api/students/${id}`, { method: 'DELETE' })
