import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminAPI, queryKeys } from "@/lib/api";
import { useSession } from "@/lib/better-auth";

// This is a development utility to help test admin functionality
export default function AdminTestPage() {
  const [email, setEmail] = useState("");
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const promoteMutation = useMutation({
    mutationFn: async (email: string) => {
      // First get all users to find the user by email
      const users = await adminAPI.getAllUsers();
      const user = users.find((u: any) => u.email === email);
      if (!user) {
        throw new Error("User not found");
      }
      return adminAPI.promoteUser(user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
      toast.success("User promoted to admin successfully");
      setEmail("");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to promote user");
    },
  });

  const handlePromote = () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    promoteMutation.mutate(email);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Test Utility</h1>
        <p className="text-muted-foreground">
          Development utility to promote users to admin
        </p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Promote User to Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">User Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          <Button
            onClick={handlePromote}
            disabled={promoteMutation.isPending}
            className="w-full"
          >
            {promoteMutation.isPending ? "Promoting..." : "Promote to Admin"}
          </Button>

          {session?.user && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Current user: {session.user.email}
              </p>
              <Button
                variant="outline"
                onClick={() => setEmail(session.user.email)}
                className="w-full mt-2"
              >
                Promote Current User
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Enter the email of the user you want to promote to admin</li>
            <li>Click "Promote to Admin" button</li>
            <li>Refresh the page to see admin navigation appear</li>
            <li>Navigate to /dashboard/admin to access admin dashboard</li>
          </ol>
          <p className="text-xs text-muted-foreground mt-4">
            Note: This is a development utility and should be removed in
            production
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
