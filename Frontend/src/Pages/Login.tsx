import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const handleGoogleLogin = () => {
    navigate( "http://localhost:3000/timailer/auth/google")
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // handled in page component
  };

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <Card className="w-105 shadow-sm">
        <CardContent className="p-8 space-y-6">
          <h1 className="text-2xl font-semibold text-center">Login</h1>
    
          {/* Google Login */}
          <Button
            variant="secondary"
            className="w-full bg-green-50 hover:bg-green-100 cursor-pointer"
            onClick={handleGoogleLogin}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5 mr-2"
            />
            Login with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Separator className="flex-1" />
            or sign up through email
            <Separator className="flex-1" />
          </div>

          {/* Email Login */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input type="email" placeholder="Email ID" required />
            <Input type="password" placeholder="Password" required />

            <Button className="w-full bg-green-600 hover:bg-green-700 cursor-pointer">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
