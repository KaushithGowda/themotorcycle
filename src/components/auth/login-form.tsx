'use client'

import CardWrapper from "@/components/auth/card-wrapper"
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form"
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils/utils";
import FormSuccess from "@/components/form-success";
import FormError from "@/components/form-error";
import { login } from "@/actions/login";

import { useState, useTransition } from "react";

const fonts = Poppins({
    weight: '600',
    subsets: ['latin']
})

const LoginForm = () => {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider" : ""
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError('');
        setSuccess('');

        startTransition(() => {
            login(values).then((data) => {
                setError(data.error);
                setSuccess(data.success);
            })
        });
    };

    return <CardWrapper headerTitle="🔐 Auth" headerLabel="Welcome back" showSocial backBtnHref={"/auth/register"} backBtnLabel={"Don't have an account?"}>
        <Form {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-3">
                    <FormField name="email" control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={cn("capitalize", fonts.className)}>{field.name}</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} type="email" placeholder="joe@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField name="password" control={form.control}
                        render={({ field }) => (
                            <FormItem className="mb-2">
                                <FormLabel className={cn("capitalize", fonts.className)}>{field.name}</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} className="capitalize" placeholder="********" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormSuccess message={success} />
                <FormError message={error || urlError} />
                <Button disabled={isPending} type="submit" className="w-full cursor-pointer">Login</Button>
            </form>
        </Form>
    </CardWrapper>
}

export default LoginForm