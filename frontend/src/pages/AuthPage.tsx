// src/pages/AuthPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../store/auth";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { Brain } from "lucide-react";

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated, isLoading, error, clearError } =
    useAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Redirect the user to the homepage if they are already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Clears form fields and errors when switching between Login and Sign Up tabs
  const handleTabChange = () => {
    setUsername("");
    setPassword("");
    clearError();
  };

  // Handles form submission for both login and signup
  const handleSubmit = async (
    action: "login" | "signup",
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill in both username and password.");
      return;
    }

    try {
      if (action === "login") {
        await login(username, password);
      } else {
        await signup(username, password);
      }
      toast.success(
        action === "login" ? "Logged in successfully!" : "Account created!"
      );
      navigate("/"); // Navigate to home on success
    } catch (err) {
      // The error is set in the auth store; show it in a toast for immediate feedback.
      const latestError = useAuthStore.getState().error;
      toast.error(latestError || "An unexpected error occurred.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      {/* Theme Toggle - Positioned at top right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Branding - Positioned at top left */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <Brain className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        <span className="font-bold text-lg text-foreground">Mnemo</span>
      </div>

      <div className="w-full max-w-md px-4">
        <Tabs
          defaultValue="login"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
            <Card>
              <form onSubmit={(e) => handleSubmit("login", e)}>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username</Label>
                    <Input
                      id="login-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. johndoe"
                      required
                      autoComplete="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                  {error && (
                    <p className="text-sm font-medium text-red-500 dark:text-red-400">
                      {error}
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log In"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Sign Up Form */}
          <TabsContent value="signup">
            <Card>
              <form onSubmit={(e) => handleSubmit("signup", e)}>
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>
                    Enter a username and password to get started.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      required
                      autoComplete="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Choose a strong password"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  {error && (
                    <p className="text-sm font-medium text-red-500 dark:text-red-400">
                      {error}
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
