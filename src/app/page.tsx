import Header from "@/components/auth/header";
import { LoginButton } from "@/components/auth/login-button";

export default function Home() {
  return (
    <main className="flex justify-center items-center h-full w-full">
      <div className="space-y-6 text-center">
        <Header title="🔐 next-auth" label="welcome to next-auth" />
        <LoginButton asChild={false} mode='redirect'>
          Sign in
        </LoginButton>
      </div>
    </main>
  );
}
