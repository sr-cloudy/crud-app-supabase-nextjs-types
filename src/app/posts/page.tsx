'use client';
import { useEffect, useState } from 'react';

// Define Post type
interface Post {
  id: number; // Postgres autoincrement id
  title: string;
  content: string;
}

// Define form state type separately
interface PostForm {
  id: number | null;
  title: string;
  content: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState<PostForm>({
    id: null,
    title: '',
    content: '',
  });

  // fetch posts
  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    const data: Post[] = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // create or update
  const savePost = async () => {
    if (form.id) {
      await fetch(`/api/posts/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, content: form.content }),
      });
    } else {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, content: form.content }),
      });
    }
    setForm({ id: null, title: '', content: '' });
    fetchPosts();
  };

  // delete
  const deletePost = async (id: number) => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  // edit (load into form)
  const editPost = (post: Post) => {
    setForm({ id: post.id, title: post.title, content: post.content });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Posts CRUD</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          savePost();
        }}
        className="mb-6 space-y-2"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border px-2 py-1 w-full"
        />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          className="border px-2 py-1 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          {form.id ? 'Update Post' : 'Add Post'}
        </button>
      </form>

      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id} className="border p-3 rounded">
            <h2 className="font-semibold">{post.title}</h2>
            <p>{post.content}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => editPost(post)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deletePost(post.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
