import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { subscriptionAPI, queryKeys } from "@/lib/api";
import { useSession } from "@/lib/better-auth";
import { toast } from "sonner";
import {
  Crown,
  CreditCard,
  Calendar,
  BarChart3,
  MessageSquare,
  Mic,
  Zap,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Shield,
} from "lucide-react";

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Get user's current subscription
  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: queryKeys.subscription.userSubscription,
    queryFn: subscriptionAPI.getUserSubscription,
    enabled: !!session,
  });

  // Get all available plans
  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: queryKeys.subscription.plans,
    queryFn: subscriptionAPI.getPlans,
  });

  // Get user's usage
  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: queryKeys.subscription.usage,
    queryFn: subscriptionAPI.getUserUsage,
    enabled: !!session,
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: subscriptionAPI.createSubscription,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscription.userSubscription,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.usage });
      toast.success("Subscription updated successfully!", {
        description: `You are now on the ${data.plan.name} plan.`,
      });
      setIsUpgrading(false);
    },
    onError: (error: any) => {
      toast.error("Failed to update subscription", {
        description: error.message || "Please try again.",
      });
      setIsUpgrading(false);
    },
  });

  const isLoading = subscriptionLoading || plansLoading || usageLoading;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading subscription...</div>
        </div>
      </div>
    );
  }

  const currentPlan = subscription?.plan;
  const availablePlans = plans.filter(
    (plan: any) => plan.id !== currentPlan?.id,
  );

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case "FREE":
        return <Zap className="w-5 h-5" />;
      case "BASIC":
        return <MessageSquare className="w-5 h-5" />;
      case "STANDARD":
        return <BarChart3 className="w-5 h-5" />;
      case "PREMIUM":
        return <Crown className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case "FREE":
        return "text-blue-600";
      case "BASIC":
        return "text-green-600";
      case "STANDARD":
        return "text-purple-600";
      case "PREMIUM":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const handleUpgrade = (planId: string) => {
    setIsUpgrading(true);
    createSubscriptionMutation.mutate(planId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Subscription & Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and view usage statistics
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentPlan ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg bg-primary/10 ${getPlanColor(
                      currentPlan.type,
                    )}`}
                  >
                    {getPlanIcon(currentPlan.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {currentPlan.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {currentPlan.currency}
                      {currentPlan.price}/month
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    subscription?.status === "ACTIVE" ? "default" : "secondary"
                  }
                >
                  {subscription?.status}
                </Badge>
              </div>

              {/* Plan Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Plan Features</h4>
                  <ul className="space-y-1">
                    {currentPlan.features.map(
                      (feature: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {feature}
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                {/* Billing Info */}
                <div>
                  <h4 className="font-medium mb-2">Billing Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>
                        Current period:{" "}
                        {new Date(
                          subscription?.currentPeriodStart || "",
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          subscription?.currentPeriodEnd || "",
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    {subscription?.cancelAtPeriodEnd && (
                      <div className="flex items-center gap-2 text-orange-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>Will cancel at period end</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No Active Subscription
              </h3>
              <p className="text-muted-foreground mb-4">
                You don't have an active subscription. Choose a plan to get
                started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      {usage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Usage This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Voice Minutes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Voice Minutes</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {usage.voiceMinutesUsed} / {usage.voiceMinutesLimit}
                  </span>
                </div>
                <Progress
                  value={
                    (usage.voiceMinutesUsed / usage.voiceMinutesLimit) * 100
                  }
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {usage.voiceMinutesLimit - usage.voiceMinutesUsed} minutes
                  remaining
                </p>
              </div>

              {/* Text Messages */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Text Messages</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {usage.textMessagesUsed} / {usage.textMessagesLimit}
                  </span>
                </div>
                <Progress
                  value={
                    (usage.textMessagesUsed / usage.textMessagesLimit) * 100
                  }
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {usage.textMessagesLimit - usage.textMessagesUsed} messages
                  remaining
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      {availablePlans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Available Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    plan.isPopular
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  {plan.isPopular && (
                    <Badge className="mb-2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`p-2 rounded-lg bg-primary/10 ${getPlanColor(
                        plan.type,
                      )}`}
                    >
                      {getPlanIcon(plan.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{plan.name}</h4>
                      <p className="text-2xl font-bold">
                        {plan.currency}
                        {plan.price}
                        <span className="text-sm font-normal text-muted-foreground">
                          /month
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mic className="w-4 h-4 text-blue-600" />
                      <span>{plan.voiceMinutes} voice minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                      <span>{plan.textMessages} text messages</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isUpgrading}
                    className="w-full"
                    variant={plan.isPopular ? "default" : "outline"}
                  >
                    {isUpgrading ? "Upgrading..." : "Upgrade"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
