import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  createAccountWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOutCurrentUser,
  subscribeAuthState,
} from "./authenticationService.js";
import { auth, googleAuthProvider } from "../firebase/firebaseClient.js";

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("../firebase/firebaseClient.js", () => ({
  auth: { name: "auth" },
  googleAuthProvider: { name: "google-provider" },
}));

describe("身分驗證服務", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates an account with email and password", async () => {
    const credential = { user: { uid: "user-1" } };
    createUserWithEmailAndPassword.mockResolvedValue(credential);

    await expect(
      createAccountWithEmail("user@example.com", "password"),
    ).resolves.toBe(credential);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "user@example.com",
      "password",
    );
  });

  it("signs in with email and password", async () => {
    await signInWithEmail("user@example.com", "password");

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "user@example.com",
      "password",
    );
  });

  it("signs in with the configured Google provider", async () => {
    await signInWithGoogle();

    expect(signInWithPopup).toHaveBeenCalledWith(auth, googleAuthProvider);
  });

  it("signs out the current user", async () => {
    await signOutCurrentUser();

    expect(signOut).toHaveBeenCalledWith(auth);
  });

  it("subscribes to authentication state changes", () => {
    const onChange = vi.fn();
    const unsubscribe = vi.fn();
    onAuthStateChanged.mockReturnValue(unsubscribe);

    expect(subscribeAuthState(onChange)).toBe(unsubscribe);
    expect(onAuthStateChanged).toHaveBeenCalledWith(auth, onChange);
  });
});
