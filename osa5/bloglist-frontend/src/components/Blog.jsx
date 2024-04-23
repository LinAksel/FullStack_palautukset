import { useState } from 'react';

const Blog = ({ blog, updateBlog }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const updateLikes = () => {
    const newBlog = {...blog, likes: blog.likes+1, user: blog.user['id']}
    updateBlog(newBlog)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'show'}</button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            {blog.likes}
            <button onClick={updateLikes}>like</button>
          </div>
          {blog.user &&
            <div>{blog.user['name']}</div>
          }
        </div>
      )}
    </div>
  );
};

export default Blog;
