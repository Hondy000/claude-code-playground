import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [count, setCount] = useState(0);

  // カウンターのデモ
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false,
        },
      ]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodos = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="app">
      <header>
        <h1>⚡ Bun + React Todo App</h1>
        <p className="subtitle">Powered by Bun&apos;s ultra-fast bundler</p>
        <div className="counter">
          アプリ起動から: <span className="count">{count}</span>秒
        </div>
      </header>

      <main>
        <div className="input-section">
          <input
            type="text"
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === 'Enter' && addTodo()
            }
            placeholder="新しいTodoを入力..."
            className="todo-input"
          />
          <button onClick={addTodo} className="add-button">
            追加
          </button>
        </div>

        <div className="filter-section">
          <button
            onClick={() => setFilter('all')}
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          >
            すべて
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`filter-button ${filter === 'active' ? 'active' : ''}`}
          >
            未完了
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
          >
            完了済み
          </button>
        </div>

        <div className="todos-list">
          {filteredTodos.length === 0 ? (
            <p className="empty-state">Todoがありません</p>
          ) : (
            filteredTodos.map((todo) => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <span className="todo-text">{todo.text}</span>
                <button onClick={() => deleteTodo(todo.id)} className="delete-button">
                  削除
                </button>
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className="footer">
            <span>{activeTodos}個の未完了タスク</span>
            {todos.some((todo) => todo.completed) && (
              <button
                onClick={() => setTodos(todos.filter((todo) => !todo.completed))}
                className="clear-button"
              >
                完了済みをクリア
              </button>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Built with Bun {process.env.BUN_VERSION || 'latest'}</p>
        <p>Bundle size and performance optimized ⚡</p>
      </footer>
    </div>
  );
}

export default App;
