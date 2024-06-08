'use server'
import { createAuthSession, destroySession } from "@/lib/auth"
import { hashUserPassword, verifyPassword } from "@/lib/hash"
import { createUser, getUserByEmail } from "@/lib/user"
import { redirect } from "next/navigation"
export async function signup(prevState, formData) {

  //destructure the form
  const email = formData.get('email')
  const password = formData.get('password')

  //validate
  let errors = {}

  if (!email.includes('@')) {
    errors.email = 'Please eneter a valid email address.'
  }

  if (password.trim().length < 8) {
    errors.password = 'Password must be at least 8 Chars Long'
  }

  //check if we have errors
  if (Object.keys(errors).length > 0) {
    return {
      errors
    }
  }

  const hashedPassword = hashUserPassword(password);
  try {
    const id = createUser(email, hashedPassword);
    await createAuthSession(id);
    redirect('/training');
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        errors: {
          email:
            'It seems like an account for the chosen email already exists.',
        },
      }
    }
    throw error;
  }
}

export async function login(prevState, formData) {
  const email = formData.get('email')
  const password = formData.get('password')

  const exisitingUser = getUserByEmail(email)

  if (!exisitingUser) {
    return {
      errors: {
        email: 'Could not authenticate user'
      }
    }
  }

  const isValidPassword = verifyPassword(exisitingUser.password, password)

  if (!isValidPassword) {
    return {
      errors: {
        password: 'Could not authenticate user'
      }
    }
  }

  await createAuthSession(exisitingUser.id)
  redirect('/training')

}

export async function auth(mode, prevState, formData) {
  if (mode === 'login') {
    return login(prevState, formData)
  }
  return signup(prevState, formData)
}

export async function logout() {
  await destroySession()
  redirect('/')
}
