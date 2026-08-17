import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import App from './App'

afterEach(() => {
  cleanup()
})

describe('Settings form', () => {
  it('shows validation errors when required fields are empty', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(
      screen.getByRole('button', { name: /save settings/i }),
    )

    expect(screen.getByText('Name is required.')).toBeInTheDocument()
    expect(screen.getByText('Email is required.')).toBeInTheDocument()
  })

  it('rejects an invalid email address', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.type(screen.getByLabelText(/name/i), 'Irina')
    await user.type(screen.getByLabelText(/email/i), 'irina@')

    await user.click(
      screen.getByRole('button', { name: /save settings/i }),
    )

    expect(
      screen.getByText('Enter a valid email address.'),
    ).toBeInTheDocument()
  })

  it('requires a password to contain at least 8 characters', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.type(screen.getByLabelText(/name/i), 'Irina')
    await user.type(
      screen.getByLabelText(/email/i),
      'irina@example.com',
    )
    await user.type(screen.getByLabelText('New password'), '1234567')
    await user.type(screen.getByLabelText('Confirm password'), '1234567')

    await user.click(
      screen.getByRole('button', { name: /save settings/i }),
    )

    expect(
      screen.getByText('Password must be at least 8 characters.'),
    ).toBeInTheDocument()
  })

  it('rejects passwords that do not match', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.type(screen.getByLabelText(/name/i), 'Irina')
    await user.type(
      screen.getByLabelText(/email/i),
      'irina@example.com',
    )
    await user.type(screen.getByLabelText('New password'), 'password123')
    await user.type(
      screen.getByLabelText('Confirm password'),
      'different123',
    )

    await user.click(
      screen.getByRole('button', { name: /save settings/i }),
    )

    expect(
      screen.getByText('Passwords do not match.'),
    ).toBeInTheDocument()
  })

  it('submits successfully with valid values', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.type(screen.getByLabelText(/name/i), 'Irina')
    await user.type(
      screen.getByLabelText(/email/i),
      'irina@example.com',
    )
    await user.type(screen.getByLabelText('New password'), 'password123')
    await user.type(
      screen.getByLabelText('Confirm password'),
      'password123',
    )

    await user.click(
      screen.getByRole('button', { name: /save settings/i }),
    )

    expect(
      screen.getByText('Settings saved successfully.'),
    ).toBeInTheDocument()
  })

  it('allows the password fields to remain empty', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.type(screen.getByLabelText(/name/i), 'Irina')
    await user.type(
      screen.getByLabelText(/email/i),
      'irina@example.com',
    )

    await user.click(
      screen.getByRole('button', { name: /save settings/i }),
    )

    expect(
      screen.getByText('Settings saved successfully.'),
    ).toBeInTheDocument()
  })
})