const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'testaajat',
        password: 'salainen',
        name: 'Testaaja T.',
      },
    })

    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testaajat', 'salainen')

      await expect(page.getByText('Testaaja T. logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testaajat', 'salanen')
      await expect(page.getByText('Testaaja T. logged in')).not.toBeVisible()
      await expect(
        page.getByText('Login failed: invalid username or password')
      ).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/testing/reset')
      await request.post('http://localhost:3003/api/users', {
        data: {
          username: 'testaajat',
          password: 'salainen',
          name: 'Testaaja T.',
        },
      })

      await page.goto('http://localhost:5173')
      await loginWith(page, 'testaajat', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Testing tests', 'Testi Testaaja', 'testi.testi')
      await expect(page.getByText('Testing tests Testi Testaaja')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Testing tests', 'Testi Testaaja', 'testi.testi')
      await page.getByRole('button', { name: 'show' }).click()
      //Check that no 1 is found before
      await expect(page.getByText('1')).not.toBeVisible()
      await expect(page.getByText('0')).toBeVisible()
      //Has to wait for side effect GET response before continuing
      await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url() === 'http://localhost:5173/api/blogs' &&
            response.status() === 200
        ),
        await page.getByRole('button', { name: 'like' }).click(),
      ])
      await expect(page.getByText('1')).toBeVisible()
    })
  })
})
