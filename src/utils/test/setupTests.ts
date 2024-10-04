import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('firebase/auth', async () => {
  const actualAuth =
    await vi.importActual<typeof import('firebase/auth')>('firebase/auth');

  return {
    ...actualAuth,
    getAuth: () => ({
      signInWithEmailAndPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChanged: vi.fn(),
      createUserWithEmailAndPassword: vi.fn(),
      updateProfile: vi.fn(),
      currentUser: {
        getIdToken: vi.fn(),
        uid: 'mocked-uid',
        email: 'test@example.com',
        displayName: '홍길동',
      },
    }),
  };
});

vi.mock('firebase/firestore', async () => {
  const actualFirestore =
    await vi.importActual<typeof import('firebase/firestore')>(
      'firebase/firestore'
    );

  return {
    ...actualFirestore,
    collection: vi.fn(),
    doc: vi.fn(),
    runTransaction: vi.fn(),
    serverTimestamp: vi.fn(() => 'mocked-timestamp'),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
  };
});

vi.mock('zustand');

vi.mock('js-cookie', () => ({
  set: vi.fn(),
  get: vi.fn(),
  remove: vi.fn(),
}));

vi.mock('@/firebase', async () => {
  const actualFirebase = await vi.importActual('@/firebase');
  return {
    ...actualFirebase,
    auth: require('firebase/auth'),
    db: {},
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
