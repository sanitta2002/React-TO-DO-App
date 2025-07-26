import { useEffect, useState } from "react"


type Task = {
  id: number,
  text: string,
  completed: boolean
}

function Todo() {
  const [task, setTask] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [editId, setEditId] = useState<number | null>(null)
  const [editedText, setEditedText] = useState("")


  useEffect(() => {

    const saved = localStorage.getItem('myTask')
    if (saved) {
      setTask(JSON.parse(saved));
    }
  }, [])

  console.log(task)


  function AddTask() {
    if (newTask.trim() === "") return

    const dupicate = task.some((t) => t.text.toLowerCase() === newTask.trim().toLowerCase())
    if (dupicate) {
      alert("Task already exists !")
      return
    }

    const newTaskItem: Task = {
      id: Date.now(),
      text: newTask,
      completed: false
    }
    localStorage.setItem('myTask', JSON.stringify([...task, newTaskItem]))
    console.log(newTaskItem)
    setTask(t => [...t, newTaskItem])
    setNewTask('')

  }

  function delectTask(id: number) {
    const delectTask = task.filter(t => t.id !== id)
    setTask(delectTask)
  }

  function startEditing(id: number, text: string) {
    setEditId(id)
    setEditedText(text)
  }

  function saveEditedTask(id: number): void {
    console.log('from save fun', task)
    if (editedText.trim() === "") {
      alert('task connot be empty')
      return
    }
    const dupicate = task.some((item) => item.text === editedText.trim() && item.id !== id)
    if (dupicate) {
      alert("This task already exists")
      return
    }
    const updatedTasks: Task[] = task.map((item): Task => {

      if (item.id === id) {
        return { ...item, text: editedText }
      }
      return item
    }
    )
    setTask(updatedTasks)
    localStorage.setItem('myTask', JSON.stringify(updatedTasks))
    setEditId(null)
    setEditedText('')
  }

  function toggleComplete(id: number): void {
    const updatedTasks = task.map((item): Task => {
      if (item.id === id) {
        return { ...item, completed: !item.completed }
      }
      return item
    }
    )
    setTask(updatedTasks)
    localStorage.setItem('myTask', JSON.stringify(updatedTasks))
  }



  return (
    <div className="todo-container">
      <h1>TO-DO-List</h1>
      <div>

        <input type="text" placeholder="Enter Task" value={newTask} onChange={e => setNewTask(e.target.value)} />
        <button onClick={AddTask}>ADD</button>
        <ul>

          {task.map((item) => (
            <li key={item.id} className={item.completed ? "completed" : ""}>
              {editId !== item.id ? (
                <>
                  <input type="checkbox" checked={item.completed} onChange={() => toggleComplete(item.id)} />
                  <span>{item.text}</span>
                  <button onClick={() => startEditing(item.id, item.text)}>Edit</button>
                  <button onClick={() => delectTask(item.id)}>Delect</button>

                </>
              ) : (
                <>
                  <input
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                  <button className="save-btn" onClick={() => saveEditedTask(item.id)}>Save</button>
                </>
              )}
            </li>
          ))}

        </ul>
      </div>
    </div>

  )
}

export default Todo