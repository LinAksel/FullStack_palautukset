import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls createBlog with correct content', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog}/>)

  const sendButton = screen.getByText('create')
  const titleInput = screen.getByPlaceholderText('Write title here')
  const authorInput = screen.getByPlaceholderText('Write author name here')
  const urlInput = screen.getByPlaceholderText('Write url here')

  await user.type(titleInput, 'Testing Title')
  await user.type(authorInput, 'Testi Testeri')
  await user.type(urlInput, 'test.com')
  await user.click(sendButton)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0]).contains('Testing Title')
  expect(createBlog.mock.calls[0]).contains('Testi Testeri')
  expect(createBlog.mock.calls[0]).contains('test.com')
})
