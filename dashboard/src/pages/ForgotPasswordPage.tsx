import { useState } from "react";
import { Link } from "react-router-dom";
import { authClient } from "@/lib/better-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    await authClient.requestPasswordReset(
      { email, redirectTo: "/reset-password" },
      {
        onSuccess: () => {
          // Always show success message for security (don't reveal if user exists)
          setStatus("sent");
        },
        onError: ({ error }) => {
          setStatus("error");
          setError(error.message);
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "sent" ? (
            <div className="text-center">
              <p className="text-lg font-semibold">Check your email</p>
              <p className="text-muted-foreground">
                If an account with that email exists, we've sent a password
                reset link.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={status === "sending"}
              >
                {status === "sending"
                  ? "Sending..."
                  : "Send Password Reset Link"}
              </Button>
            </form>
          )}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgotPasswordPage;
