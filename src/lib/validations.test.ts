import {
  createOrganizationSchema,
  forgotPasswordSchema,
  inviteMemberSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  updateOrganizationSchema,
  updateProfileSchema,
} from './validations'

describe('signUpSchema', () => {
  const valid = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password1',
    confirmPassword: 'Password1',
  }

  it('accepts valid input', () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects short name', () => {
    const result = signUpSchema.safeParse({ ...valid, name: 'J' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = signUpSchema.safeParse({ ...valid, email: 'bad' })
    expect(result.success).toBe(false)
  })

  it('rejects weak password', () => {
    expect(
      signUpSchema.safeParse({
        ...valid,
        password: 'short',
        confirmPassword: 'short',
      }).success
    ).toBe(false)
    expect(
      signUpSchema.safeParse({
        ...valid,
        password: 'password1',
        confirmPassword: 'password1',
      }).success
    ).toBe(false)
    expect(
      signUpSchema.safeParse({
        ...valid,
        password: 'Password',
        confirmPassword: 'Password',
      }).success
    ).toBe(false)
  })

  it('rejects mismatched passwords', () => {
    const result = signUpSchema.safeParse({
      ...valid,
      confirmPassword: 'Different1',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Passwords don't match")
    }
  })
})

describe('signInSchema', () => {
  it('accepts valid credentials', () => {
    expect(
      signInSchema.safeParse({ email: 'a@b.com', password: 'x' }).success
    ).toBe(true)
  })

  it('rejects invalid email and empty password', () => {
    expect(signInSchema.safeParse({ email: 'bad', password: '' }).success).toBe(
      false
    )
  })
})

describe('forgotPasswordSchema', () => {
  it('validates email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'a@b.com' }).success).toBe(
      true
    )
    expect(forgotPasswordSchema.safeParse({ email: 'invalid' }).success).toBe(
      false
    )
  })
})

describe('resetPasswordSchema', () => {
  it('validates matching passwords', () => {
    expect(
      resetPasswordSchema.safeParse({
        password: 'Password1',
        confirmPassword: 'Password1',
      }).success
    ).toBe(true)
    expect(
      resetPasswordSchema.safeParse({
        password: 'Password1',
        confirmPassword: 'Other1',
      }).success
    ).toBe(false)
  })
})

describe('createOrganizationSchema', () => {
  it('accepts valid organization', () => {
    expect(
      createOrganizationSchema.safeParse({ name: 'Acme', slug: 'acme-corp' })
        .success
    ).toBe(true)
  })

  it('rejects invalid slug', () => {
    expect(
      createOrganizationSchema.safeParse({ name: 'Acme', slug: 'Acme Corp!' })
        .success
    ).toBe(false)
  })
})

describe('updateOrganizationSchema', () => {
  it('accepts partial updates', () => {
    expect(updateOrganizationSchema.safeParse({ name: 'New' }).success).toBe(
      true
    )
    expect(updateOrganizationSchema.safeParse({ logoUrl: '' }).success).toBe(
      true
    )
    expect(
      updateOrganizationSchema.safeParse({ logoUrl: 'https://x.com/logo.png' })
        .success
    ).toBe(true)
  })

  it('rejects invalid logo url', () => {
    expect(
      updateOrganizationSchema.safeParse({ logoUrl: 'not-a-url' }).success
    ).toBe(false)
  })
})

describe('inviteMemberSchema', () => {
  it('validates invite input', () => {
    expect(
      inviteMemberSchema.safeParse({ email: 'a@b.com', role: 'ADMIN' }).success
    ).toBe(true)
    expect(
      inviteMemberSchema.safeParse({ email: 'bad', role: 'MEMBER' }).success
    ).toBe(false)
  })
})

describe('updateProfileSchema', () => {
  it('validates profile updates', () => {
    expect(updateProfileSchema.safeParse({}).success).toBe(true)
    expect(updateProfileSchema.safeParse({ avatarUrl: '' }).success).toBe(true)
    expect(
      updateProfileSchema.safeParse({ avatarUrl: 'not-url' }).success
    ).toBe(false)
  })
})
