import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'
const App = () => {
  const [posts, setPosts] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPostTitle, setEditingPostTitle] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Ошибка при получении постов из JSON Server:', error);
    }
  };

  const addPost = async () => {
    if (inputValue.trim() !== '') {
      try {
        await axios.post('http://localhost:3000/posts', {
          title: inputValue
        });
        setInputValue('');
        fetchPosts();
      } catch (error) {
        console.error('Ошибка при создании поста:', error);
      }
    }
  };

  const updatePost = async (id) => {
    try {
      await axios.put(`http://localhost:3000/posts/${id}`, {
        title: editingPostTitle
      });
      setEditingPostId(null);
      setEditingPostTitle('');
      fetchPosts();
    } catch (error) {
      console.error('Ошибка при обновлении поста:', error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/posts/${id}`);
      fetchPosts();
    } catch (error) {
      console.error('Ошибка при удалении поста:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={addPost}>Add</button>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {editingPostId === post.id ? (
              <>
                <input
                  type="text"
                  value={editingPostTitle}
                  onChange={(e) => setEditingPostTitle(e.target.value)}
                />
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => updatePost(post.id)}>Save</button>
              </>
            ) : (
              <>
                <div className="container">
                  <div className="info">
                    <ul>
                      <li>
                        <h3>ID: {post.id}</h3>
                        <h4>Title: {post.title}</h4>
                      </li>
                    </ul>
                    <div className='div'>
                      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border-2px ' onClick={() => setEditingPostId(post.id)}>Update</button>
                      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => deletePost(post.id)}>Delete</button>
                    </div>
                  </div>
                </div>

              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;