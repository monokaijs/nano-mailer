"use client";
import {cn} from "@/lib/utils/cn"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {useForm} from "react-hook-form";
import {authApi, RegisterDto} from "@/lib/api";
import {registerSchema} from "@/lib/validations/register";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {FieldDescription} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export function RegisterForm({
                               className,
                               ...props
                             }: React.ComponentProps<"div">) {
  const form = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: RegisterDto) => {
    try {
      const response = await authApi.register(data);
      toast.success(response.message);
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create account</CardTitle>
          <CardDescription>
            Create an account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((onSubmit))} className={'space-y-4'}>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="someone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
