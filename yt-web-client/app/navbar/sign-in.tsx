"use client";

import { Fragment } from "react";
import { signInWithGoogle, signOut } from "../firebase/firebase";
import { User } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

interface SignInProps {
  user: User | null;
}

export default function SignIn({ user }: SignInProps) {
  return (
    <Fragment>
      {user ? (
        <button
          className="text-zinc-500 hover:text-white transition-colors focus:outline-none"
          onClick={signOut}
          title="Sign Out"
        >
          <FontAwesomeIcon icon={faSignOutAlt} size="sm" />
        </button>
      ) : (
        <button
          className="text-zinc-500 hover:text-white transition-colors focus:outline-none"
          onClick={signInWithGoogle}
          title="Sign In"
        >
          <FontAwesomeIcon icon={faSignInAlt} size="sm" />
        </button>
      )}
    </Fragment>
  );
}
