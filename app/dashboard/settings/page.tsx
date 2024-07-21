import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/lib/db";
import {SubmitButtons} from "@/app/components/SubmitButtons";
import { revalidatePath } from "next/cache";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where:{
      id : userId
    },
    select:{
      name: true,
      email: true,
      colorScheme: true
    }
  })
  return data;
}

async function settings() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  async function postData(formData: FormData) {
    'use server'

    const updatedName = formData.get('name') as string;
    const updatedColorScheme = formData.get('color') as string;
    await prisma.user.update({
      where:{
        id: user?.id
      },
      data:{
        name: updatedName ?? undefined,
        colorScheme: updatedColorScheme ?? undefined
      }
    })

    revalidatePath('/','layout')
  }
  return (
    <div className="grid items-start gap-8">
      <div className="flex item-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl">Settings</h1>
          <p className="text-lg text-muted-foreground">Your Profile Settings</p>
        </div>
      </div>
      <Card className="border-primary border rounded-sm shadow-lg">
        <form action={postData}>
          <CardHeader>
            <CardTitle>General Data</CardTitle>
            <CardDescription>
              Please provide general information about yourself. Please don't
              forget to save
            </CardDescription>
            <CardContent>
              <div className="space-y-2">
                <div className="space-y-1 pt-2">
                  <Label>Your Name</Label>
                  <Input
                    name="name"
                    type="text"
                    id="name"
                    placeholder="Your Name"
                    defaultValue={data?.name ?? undefined}
                  ></Input>
                </div>
                <div className="space-y-1">
                  <Label>Your Email</Label>
                  <Input
                    name="email"
                    type="email"
                    id="email"
                    placeholder="Your Email"
                    disabled
                    defaultValue={data?.email ?? undefined}
                  ></Input>
                </div>
                <div className="space-y-1">
                  <Label>Color Scheme</Label>
                  <Select name="color" defaultValue={data?.colorScheme ?? undefined}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a color" ></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Color</SelectLabel>
                        <SelectItem value="theme-green">Green</SelectItem>
                        <SelectItem value="theme-blue">Blue</SelectItem>
                        <SelectItem value="theme-violet">Violet</SelectItem>
                        <SelectItem value="theme-yellow">Yellow</SelectItem>
                        <SelectItem value="theme-orange">Orange</SelectItem>
                        <SelectItem value="theme-red">Red</SelectItem>
                        <SelectItem value="theme-rose">Rose</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButtons/>
            </CardFooter>
          </CardHeader>
        </form>
      </Card>
    </div>
  );
}

export default settings;
