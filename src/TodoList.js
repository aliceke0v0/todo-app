import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]); // 儲存待辦事項的狀態
  const [input, setInput] = useState(''); // 輸入框的狀態
  const [editingTodo, setEditingTodo] = useState(null); // 編輯中的待辦事項

  // 從 Supabase 讀取待辦事項
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching todos:', error);
    } else {
      const validTodos = data.filter(todo => todo != null && todo.text != null && todo.completed != null);
      setTodos(validTodos);
    }
  };

  // 新增待辦事項
  const addTodo = async () => {
    if (input.trim()) {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ text: input, completed: false }])
        .single();

      if (error) {
        console.error('Error adding todo:', error);
      } else {
        setTodos(prevTodos => [data, ...prevTodos]);
        setInput(''); // 清空輸入框
      }
    }
  };

  // 編輯待辦事項
  const startEditing = (todo) => {
    setEditingTodo(todo);
    setInput(todo.text);
  };

  // 儲存編輯後的待辦事項
  const saveEdit = async () => {
    if (editingTodo && input.trim()) {
      const { data, error } = await supabase
        .from('todos')
        .update({ text: input })
        .eq('id', editingTodo.id)
        .single();

      if (error) {
        console.error('Error updating todo:', error);
      } else {
        const updatedTodos = todos.map((todo) =>
          todo.id === editingTodo.id ? { ...todo, text: input } : todo
        );
        setTodos(updatedTodos);
        setInput('');
        setEditingTodo(null);
      }
    }
  };

  // 切換待辦事項的完成狀態
  const toggleTodo = async (id, completed) => {
    const { data, error } = await supabase
      .from('todos')
      .update({ completed: !completed })
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error updating todo:', error);
    } else {
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      );
      setTodos(updatedTodos);
    }
  };

  // 刪除待辦事項
  const deleteTodo = async (id) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);

    if (error) {
      console.error('Error deleting todo:', error);
    } else {
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
    }
  };

  // 在元件載入時抓取待辦事項
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="todo-list">
      <h1>待辦事項清單</h1>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入待辦事項"
        />
        {editingTodo ? (
          <button className="save-btn" onClick={saveEdit}>儲存編輯</button>
        ) : (
          <button className="add-btn" onClick={addTodo}>新增</button>
        )}
      </div>

      <div className="todo-cards-container">
        {todos.map((todo) => (
          todo ? (
            <div
              key={todo.id}
              className={`todo-card ${todo.completed ? 'completed' : ''}`}
            >
              <div className="todo-header">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id, todo.completed)}
                />
                <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>刪除</button>
                <button className="edit-btn" onClick={() => startEditing(todo)}>編輯</button>
              </div>
              <div className="todo-content">
                <p>{todo.text}</p>
              </div>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
};

export default TodoList;
