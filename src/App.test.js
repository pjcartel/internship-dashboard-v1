import { render, screen } from "@testing-library/react";

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(() => ({})),
}));

jest.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => <div>{element}</div>,
  Navigate: () => null,
  Link: ({ to, children }) => <a href={to}>{children}</a>,
  NavLink: ({ to, children, className }) => (
    <a href={to} className={typeof className === "function" ? className({ isActive: false }) : className}>
      {children}
    </a>
  ),
  useLocation: () => ({ pathname: "/login", state: null }),
  useNavigate: () => jest.fn(),
}), { virtual: true });

const App = require("./App").default;

test("renders the internship dashboard login screen", async () => {
  render(<App />);
  expect(await screen.findByRole("heading", { name: /internship dashboard/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /admin demo/i })).toBeInTheDocument();
});
