import { Button } from "@/components/ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function  Home() {
  const {isAuthenticated} = getKindeServerSession();

  if(await isAuthenticated()){
    return redirect('/dashboard')
  }
  return (
    <section className="flex items-center justify-center bg-background h-[90vh]">
      <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-16 max-w-7xl md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <span className="w-auto px-6 py-3 rounded-full bg-secondary inline-block">
              <span className="tex-sm font-medium text-primary">
                Sorts Your Notes Easily.
              </span>
            </span>
            <h1 className="mt-8 text-3xl font-extrabold tracking-tight lg:text-6xl">
              Create Notes with ease
            </h1>
            <p className="max-w-xl mx-auto mt-8 text-base lg:text-xl text-secondary-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
              quia aperiam impedit quasi quibusdam modi deleniti aliquid nihil
              debitis, obcaecati provident iure, et quas adipisci dolorem labore
              quam ex ducimus.
            </p>
          </div>
          <div className="flex justify-center max-w-xm mx-auto mt-10">
            <RegisterLink>
              <Button>Sign Up for free</Button>
            </RegisterLink>
          </div>
        </div>
      </div>
    </section>
  );
}
