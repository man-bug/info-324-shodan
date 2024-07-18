"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import React from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { RegisterSchema } from "@/validation/register";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { registerUser } from "../actions";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function SignUp() {
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
        },
    });

    const [loading, setLoading] = React.useState(false);

    const router = useRouter();

    async function onSubmit(values: z.infer<typeof RegisterSchema>) {
        setLoading(true);
        try {
            const res = await registerUser(values);
            if (res.error) {
                setLoading(false);
                toast({
                    variant: "destructive",
                    description: res.error,
                });
            } else if (res.success) {
                setLoading(false);
                toast({
                    variant: "default",
                    description: res.message,
                });
                router.push("/");
            }
        } catch (err: any) {
            setLoading(false);
            console.error(err);
        }
    }

    return (
        <main className="flex flex-col items-center justify-center gap-2 h-screen container">
            <Card className="sm:max-w-[440px] w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
                        <CardHeader>
                            <CardTitle className="text-2xl">Create an account</CardTitle>
                            <CardDescription>
                                Already have an account?&nbsp;
                                <Button
                                    asChild
                                    variant="linkHover2"
                                    className="h-fit p-0 text-accent-blue/80 hover:text-accent-blue"
                                >
                                    <Link href="/login">Login</Link>
                                </Button>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="font-medium">Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                autoComplete="username"
                                                autoFocus
                                                placeholder="manbug"
                                                className="border text-base"
                                                {...field}
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="border text-base"
                                                autoComplete="new-password"
                                                type="password"
                                                placeholder="********"
                                                {...field}
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Confirm password</FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="new-password"
                                                type="password"
                                                placeholder="********"
                                                className="border text-base"
                                                {...field}
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="border-t rounded-b-lg bg-muted pt-6">
                            <Button disabled={loading} type="submit" size="lg" className="w-full">
                                Register
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>

            <Button variant="link" asChild>
                <Link href="/">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back to home
                </Link>
            </Button>
        </main>
    );
}
