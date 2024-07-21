import React, { ReactNode } from "react";
import DashboardNav from "../components/DashboardNav";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../lib/db";
import { stripe } from "../lib/stripe";

async function getData({
  email,
  id,
  firstname,
  lastname,
  profileimage,
}: {
  email: string;
  id: string;
  firstname: string | undefined | null;
  lastname: string | undefined | null;
  profileimage: string | undefined | null;
}) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    const name = `${firstname ?? ""} ${lastname ?? ""}`;
    await prisma.user.create({
      data: {
        id: id,
        email: email,
        name: name,
      },
    });
  }

  if(!user?.stripeCustomerId){
    const data = await stripe.customers.create({
      email: email
    });

    await prisma.user.update({
      where:{
        id: id,
      },
      data:{
        stripeCustomerId: data.id
      }
    })
  }
}

async function layout({ children }: { children: ReactNode }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    redirect("/");
  }
  
  await getData({
    email: user.email as string,
    id: user.id as string,
    firstname: user.given_name as string,
    lastname: user.family_name as string,
    profileimage: user.picture as string,
  });
  return (
    <div className="flex flex-col space-y-6 mt-10">
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex ">
          <DashboardNav />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

export default layout;
