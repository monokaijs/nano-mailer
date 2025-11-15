"use client";
import {cn} from "@/lib/utils/cn"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {LoginDto, loginSchema} from "@/lib/validations/login";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {signIn} from "next-auth/react";

export function LoginForm({
                            className,
                            ...props
                          }: React.ComponentProps<"div">) {
  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: LoginDto) => {
    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid username or password");
        return;
      }

      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-4'}>
              <FormField
                control={form.control}
                name="username"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="someone" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
