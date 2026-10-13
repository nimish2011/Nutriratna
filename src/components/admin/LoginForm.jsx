import { useState } from 'react';
import Field from '../common/Field';

/** Admin / executive sign-in. Credentials are checked by the server (set in the server's .env file). */
export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(await onLogin(username.trim(), password));
    setBusy(false);
  };

  return (
    <section>
      <div className="wrap login-wrap">
        <form className="card f" onSubmit={handleSubmit}>
          <h2 className="full">Executive sign in</h2>
          <Field label="Username" full><input required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} /></Field>
          <Field label="Password" full><input required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
          {error && <div className="full pill bad">{error}</div>}
          <button className="btn full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </div>
    </section>
  );
}
