import {render, screen} from '@testing-library/react';
import {useSession} from 'next-auth/client';
import {mocked} from 'ts-jest/utils';
import {SignInInButton} from './index';

jest.mock('next-auth/client');

describe('SignInButton component', () => {

  it("renders correctly when user is not authenticated", () => {

    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <SignInInButton />
    );
  
    expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
  
  })

  it("renders correctly when user is authenticated", () => {

    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([
      {user: {name: 'John Doe', email: 'johndoe@example.com'}, expires: 'fake-expire'}, false]);

    render(
      <SignInInButton />
    );
  
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  
  })
  
})

