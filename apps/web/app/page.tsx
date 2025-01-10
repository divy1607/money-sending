"use client"

import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  return (
    <SessionProvider>
      <OtherHome />
    </SessionProvider>
  );
}

function OtherHome() {
  const session = useSession();

  return <div>
    {session.status === "authenticated" && <button onClick={()=>signOut()}> sign out </button>}
    {session.status === "unauthenticated" && <button onClick={() => signIn()}> sign in </button>}
    {JSON.stringify(session)}
  </div>
}
