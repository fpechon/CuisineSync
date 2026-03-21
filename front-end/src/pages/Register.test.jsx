import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Register from './Register';

vi.mock('../store/authStore');

function renderRegister(registerFn = vi.fn()) {
  useAuthStore.mockReturnValue({ register: registerFn });
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
}

describe('Register', () => {
  it('affiche un message d erreur quand les mots de passe ne correspondent pas', async () => {
    const user = userEvent.setup();
    // register rejette avec un dict d'erreurs comme le ferait le back
    const registerFn = vi.fn().mockRejectedValue({ password_confirm: ['Les mots de passe ne correspondent pas.'] });
    renderRegister(registerFn);

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'alice');
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmer le mot de passe/i), 'different456');
    await user.click(screen.getByRole('button', { name: /créer mon compte/i }));

    await waitFor(() => {
      expect(screen.getByText(/les mots de passe ne correspondent pas/i)).toBeInTheDocument();
    });
  });

  it('appelle register avec les bonnes valeurs quand les mots de passe correspondent', async () => {
    const user = userEvent.setup();
    const registerFn = vi.fn().mockResolvedValue({ id: 1, username: 'alice' });
    renderRegister(registerFn);

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'alice');
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmer le mot de passe/i), 'password123');
    await user.click(screen.getByRole('button', { name: /créer mon compte/i }));

    await waitFor(() => {
      expect(registerFn).toHaveBeenCalledWith('alice', 'password123', 'password123');
    });
  });
});
