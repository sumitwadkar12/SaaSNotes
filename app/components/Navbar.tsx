import Link from "next/link";
import React from "react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import UserNav from "./UserNav";

async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser()
  return (
    <nav className="border-b bg-background h-[10vh] flex items-center">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <h1 className="font-bold text-3xl">Sumit <span className="text-primary">SaaS</span></h1>
        </Link>
        <div className="flex items-center gap-x-5">
          <ThemeToggle />
          {await isAuthenticated() ? (
            <UserNav name={user?.family_name as string} email={user?.email as string} image={user?.picture as string}/>
          ) : (
            <div className="flex items-center gap-x-5">
              <LoginLink>
                <Button>Sign In</Button>
              </LoginLink>
              <RegisterLink>
                <Button variant="secondary">Sign Up</Button>
              </RegisterLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
