"use client";

import Image from "next/image";
import Link from "next/link";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUpload, faVideo } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <nav className="flex flex-col justify-between w-20 h-full bg-zinc-900 border-r border-r-zinc-800 absolute top-0">
        <Link href="/" className="flex justify-center p-3">
          <Image
            width={80}
            height={80}
            src="https://i.ibb.co/GQK9bwS/8f65f45d5a07a76c3aae7f300e4df63b-removebg-preview.png"
            alt="YouTube Logo"
          />
        </Link>

        <div className="flex flex-col items-center space-y-8">
          <Link
            href="/"
            className="text-rose-600 hover:text-rose-700 transition-colors"
          >
            <FontAwesomeIcon icon={faHome} size="sm" />
          </Link>
          {user && (
            <Link
              href="/upload"
              className="text-rose-600 hover:text-rose-700 transition-colors"
            >
              <FontAwesomeIcon icon={faUpload} size="sm" />
            </Link>
          )}
          <Link
            href="/my-videos"
            className="text-rose-600 hover:text-rose-700 transition-colors"
          >
            <FontAwesomeIcon icon={faVideo} size="sm" />
          </Link>
        </div>

        <div className="flex justify-center border-t border-zinc-800 pt-6 pb-6">
          <SignIn user={user} />
        </div>
      </nav>

      {/* Horizontal nav with user profile */}
      <div className="top-0 left-20 right-0 bg-zinc-900 h-16 flex items-center justify-end px-4 z-10 border-b border-b-zinc-800 border-l border-l-zinc-800 absolute">
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white text-sm font-semibold">
                {user.displayName}
              </p>
              <p className="text-gray-400 text-xs">{user.email}</p>
            </div>
            <Image
              src={
                user.photoURL ||
                "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
              }
              alt="User profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
        ) : (
          <p className="text-white text-sm">Please sign in</p>
        )}
      </div>

      {/* Add margin to the main content to account for the horizontal nav */}
      <div className="ml-20 mt-16">{/* Your main content goes here */}</div>
    </>
  );
}
