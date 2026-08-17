import { useState } from 'react'
import './App.css'

const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  notifications: true,
}

function validateForm(values) {
  const errors = {}

  if (!values.name.trim()) {
    errors.name = 'Name is required.'
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (values.password && values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }

  if (values.password && !values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  return errors
}

function App() {
  const [formData, setFormData] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    const nextValue = type === 'checkbox' ? checked : value

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }))

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: '',
      }))
    }

    setSuccessMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const validationErrors = validateForm(formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setSuccessMessage('')
      return
    }

    setErrors({})
    setSuccessMessage('Settings saved successfully.')
  }

  return (
    <main className="settings-page">
      <section className="settings-card" aria-labelledby="settings-title">
        <div className="settings-header">
          <span className="eyebrow">Account</span>
          <h1 id="settings-title">Settings</h1>
          <p>
            Update your profile information, password, and notification
            preferences.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">
              Name <span aria-hidden="true">*</span>
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              autoComplete="name"
            />

            {errors.name && (
              <p id="name-error" className="error-message" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span aria-hidden="true">*</span>
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              autoComplete="email"
            />

            {errors.email && (
              <p id="email-error" className="error-message" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">New password</label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? 'password-error' : 'password-hint'
              }
              autoComplete="new-password"
            />

            {errors.password ? (
              <p id="password-error" className="error-message" role="alert">
                {errors.password}
              </p>
            ) : (
              <p id="password-hint" className="field-hint">
                Leave blank to keep your current password.
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword
                  ? 'confirm-password-error'
                  : undefined
              }
              autoComplete="new-password"
            />

            {errors.confirmPassword && (
              <p
                id="confirm-password-error"
                className="error-message"
                role="alert"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="notification-setting">
            <div>
              <label htmlFor="notifications">Email notifications</label>
              <p>Receive product updates and important account messages.</p>
            </div>

            <input
              id="notifications"
              name="notifications"
              type="checkbox"
              checked={formData.notifications}
              onChange={handleChange}
            />
          </div>

          {successMessage && (
            <p className="success-message" role="status" aria-live="polite">
              {successMessage}
            </p>
          )}

          <button className="save-button" type="submit">
            Save settings
          </button>
        </form>
      </section>
    </main>
  )
}

export default App