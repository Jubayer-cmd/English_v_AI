import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { authClient } from "@/lib/better-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      authClient.verifyEmail(
        { token },
        {
          onSuccess: () => {
            setStatus("success");
          },
          onError: ({ error }) => {
            setStatus("error");
            setError(error.message);
          },
        },
      );
    } else {
      setStatus("error");
      setError("No verification token found.");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {status === "verifying" && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Verifying your email...</p>
            </div>
          )}
          {status === "success" && (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <p className="text-lg font-semibold">Email Verified!</p>
              <p className="text-muted-foreground mb-4">
                Your email has been successfully verified.
              </p>
              <Button asChild>
                <Link to="/login">Continue to Login</Link>
              </Button>
            </div>
          )}
          {status === "error" && (
            <div className="flex flex-col items-center">
              <XCircle className="w-16 h-16 text-destructive mb-4" />
              <p className="text-lg font-semibold">Verification Failed</p>
              <p className="text-muted-foreground mb-4">
                {error || "An unknown error occurred."}
              </p>
              <Button asChild>
                <Link to="/login">Back to Login</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default VerifyEmailPage;
