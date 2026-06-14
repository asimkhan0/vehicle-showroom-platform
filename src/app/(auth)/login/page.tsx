import { AuthForm } from '../_components/auth-form'
import { signIn } from '../actions'

export default function LoginPage() {
  return <AuthForm mode="sign-in" action={signIn} />
}
