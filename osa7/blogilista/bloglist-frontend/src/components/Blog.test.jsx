import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const blog = {
    title: 'Testing with tests',
    author: 'True Tester',
    url: 'testi.testing',
    likes: '666',
    user: { name: 'Testi Testaaja', id: '1234' },
  }
  const updateBlog = vi.fn()

  beforeEach(() => {
    render(<Blog blog={blog} updateBlog={updateBlog} />)
  })

  test('renders title', () => {
    const element = screen.getByText(/Testing with tests/)
    expect(element).toBeDefined()
  })

  test('does not render URL or likes by default', () => {
    const element1 = screen.queryByText(/testi.testing/)
    const element2 = screen.queryByText(/666/)
    expect(element1).toBeNull()
    expect(element2).toBeNull()
  })
  test('does render URL, likes and user after button click', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const element1 = screen.queryByText(/testi.testing/)
    const element2 = screen.queryByText(/666/)
    const element3 = screen.queryByText(/Testi Testaaja/)
    expect(element1).toBeDefined()
    expect(element2).toBeDefined()
    expect(element3).toBeDefined()
  })
  test('updates calls updateBlog twice when clicking like twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})
