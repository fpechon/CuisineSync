import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Login from './Login';

vi.mock('../store/authStore');

function renderLogin() {
  useAuthStore.mockReturnValue({ login: vi.fn() });
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe('Login', () => {
  it('affiche le champ username', () => {
    renderLogin();
    expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeInTheDocument();
  });

  it('affiche le champ password', () => {
    renderLogin();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
  });

  it('affiche le bouton de soumission', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });
});
