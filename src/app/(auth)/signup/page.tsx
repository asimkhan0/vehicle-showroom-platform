import { AuthForm } from '../_components/auth-form'
import { signUp } from '../actions'

export default function SignupPage() {
  return <AuthForm mode="sign-up" action={signUp} />
}
