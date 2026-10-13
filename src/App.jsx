import { useMemo, useState } from 'react'
import './App.css'

const filters = [
  { label: 'All tasks', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
]

function App() {
  const [todos, setTodos] = useState([])
  const [newDescription, setNewDescription] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editingDescription, setEditingDescription] = useState('')

  const completedCount = todos.filter((todo) => todo.completed).length
  const pendingCount = todos.length - completedCount
  const visibleTodos = useMemo(() => {
    const orderedTodos = [...todos].sort(
      (first, second) => Number(second.completed) - Number(first.completed),
    )

    if (filter === 'all') return orderedTodos
    return orderedTodos.filter((todo) =>
      filter === 'completed' ? todo.completed : !todo.completed,
    )
  }, [filter, todos])

  function addTodo(event) {
    event.preventDefault()
    setTodos((currentTodos) => [
      ...currentTodos,
      { id: crypto.randomUUID(), description: newDescription, completed: false },
    ])
    setNewDescription('')
  }

  function startEditing(todo) {
    setEditingId(todo.id)
    setEditingDescription(todo.description)
  }

  function cancelEditing() {
    setEditingId(null)
    setEditingDescription('')
  }

  function saveEdit(id) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, description: editingDescription } : todo,
      ),
    )
    cancelEditing()
  }

  function completeTodo(id) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: true } : todo,
      ),
    )
  }

  function deleteTodo(todo) {
    if (!window.confirm('Delete this completed task?')) return
    setTodos((currentTodos) =>
      currentTodos.filter((currentTodo) => currentTodo.id !== todo.id),
    )
  }

  return (
    <main className="app-shell">
      <section className="todo-card" aria-labelledby="page-title">
        <header className="page-header">
          <div className="eyebrow"><span aria-hidden="true">✦</span> YOUR DAY, YOUR WAY</div>
          <h1 id="page-title">Things to do<span>.</span></h1>
          <p className="page-subtitle">A little progress goes a long way.</p>
        </header>

        <div className="overview" aria-label="Task overview">
          <div className="overview-item">
            <span className="overview-number">{todos.length}</span>
            <span className="overview-label">Total tasks</span>
          </div>
          <div className="overview-divider" aria-hidden="true" />
          <div className="overview-item">
            <span className="overview-number">{pendingCount}</span>
            <span className="overview-label">To do</span>
          </div>
          <div className="overview-divider" aria-hidden="true" />
          <div className="overview-item">
            <span className="overview-number">{completedCount}</span>
            <span className="overview-label">Done</span>
          </div>
        </div>

        <form className="add-form" onSubmit={addTodo}>
          <label className="visually-hidden" htmlFor="new-todo">Add a task</label>
          <input
            id="new-todo"
            type="text"
            placeholder="What needs doing?"
            value={newDescription}
            onChange={(event) => setNewDescription(event.target.value)}
          />
          <button className="add-button" type="submit">Add task <span aria-hidden="true">+</span></button>
        </form>

        <div className="list-heading">
          <h2>Your tasks</h2>
          {todos.length > 0 && (
            <span className="task-count">{todos.length} {todos.length === 1 ? 'task' : 'tasks'}</span>
          )}
        </div>

        {visibleTodos.length === 0 ? (
          <div className="empty-state" role="status">
            <span className="empty-icon" aria-hidden="true">✓</span>
            <p>No todo is available</p>
            <span>Add a task above to get started.</span>
          </div>
        ) : (
          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <li
                className={`todo-item${todo.completed ? ' is-completed' : ''}`}
                key={todo.id}
              >
                {editingId === todo.id ? (
                  <form
                    className="edit-form"
                    onSubmit={(event) => {
                      event.preventDefault()
                      saveEdit(todo.id)
                    }}
                  >
                    <label className="visually-hidden" htmlFor={`edit-${todo.id}`}>
                      Edit task
                    </label>
                    <input
                      autoFocus
                      id={`edit-${todo.id}`}
                      value={editingDescription}
                      onChange={(event) => setEditingDescription(event.target.value)}
                    />
                    <div className="todo-actions">
                      <button className="action-button cancel-button" type="button" onClick={cancelEditing}>
                        Cancel
                      </button>
                      <button className="action-button confirm-button" type="submit">
                        Confirm
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <input
                      className="todo-checkbox"
                      type="checkbox"
                      checked={todo.completed}
                      disabled={todo.completed}
                      onChange={() => completeTodo(todo.id)}
                      aria-label={`Mark "${todo.description}" as completed`}
                    />
                    <span className="todo-description">{todo.description}</span>
                    <div className="todo-actions">
                      {!todo.completed ? (
                        <button
                          className="action-button edit-button"
                          type="button"
                          onClick={() => startEditing(todo)}
                          aria-label={`Edit "${todo.description}"`}
                        >
                          Edit
                        </button>
                      ) : (
                        <button
                          className="action-button delete-button"
                          type="button"
                          onClick={() => deleteTodo(todo)}
                          aria-label={`Delete "${todo.description}"`}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {todos.length > 0 && (
          <nav className="filters" aria-label="Filter tasks">
            {filters.map((option) => (
              <button
                className={`filter-button${filter === option.value ? ' is-selected' : ''}`}
                type="button"
                key={option.value}
                aria-pressed={filter === option.value}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
                {option.value === 'all' && <span className="filter-count">{todos.length}</span>}
              </button>
            ))}
          </nav>
        )}
      </section>
      <footer className="page-footer">One thing at a time. You’ve got this.</footer>
    </main>
  )
}

export default App
