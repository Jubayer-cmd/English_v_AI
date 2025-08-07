import { PrismaClient, PlanType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create subscription plans
  const plans = [
    {
      name: "Free",
      type: PlanType.FREE,
      price: 0,
      currency: "৳",
      billingCycle: "monthly",
      voiceMinutes: 15,
      textMessages: 100,
      features: [
        "1 free 15-min voice session",
        "Basic chat",
        "Limited voice commands",
        "Email support",
      ],
      isActive: true,
      isPopular: false,
    },
    {
      name: "Basic",
      type: PlanType.BASIC,
      price: 200,
      currency: "৳",
      billingCycle: "monthly",
      voiceMinutes: 56,
      textMessages: 875,
      features: [
        "Voice + chat",
        "Real-time transcription",
        "Basic voice commands",
        "Text chat",
        "Email support",
      ],
      isActive: true,
      isPopular: false,
    },
    {
      name: "Standard",
      type: PlanType.STANDARD,
      price: 300,
      currency: "৳",
      billingCycle: "monthly",
      voiceMinutes: 84,
      textMessages: 1312,
      features: [
        "Enhanced voice recognition",
        "Custom wake words",
        "Multilingual support",
        "Sentiment analysis",
        "Email + Discord support",
      ],
      isActive: true,
      isPopular: true,
    },
    {
      name: "Premium",
      type: PlanType.PREMIUM,
      price: 500,
      currency: "৳",
      billingCycle: "monthly",
      voiceMinutes: 140,
      textMessages: 382,
      features: [
        "Priority support (call/WhatsApp)",
        "Advanced voice modulation",
        "Custom voice personas",
        "GPT-4 powered chat",
      ],
      isActive: true,
      isPopular: false,
    },
  ];

  // Create plans
  for (const planData of plans) {
    const existingPlan = await prisma.plan.findUnique({
      where: { type: planData.type },
    });

    if (existingPlan) {
      console.log(`📝 Updating plan: ${planData.name}`);
      await prisma.plan.update({
        where: { type: planData.type },
        data: planData,
      });
    } else {
      console.log(`✨ Creating plan: ${planData.name}`);
      await prisma.plan.create({
        data: planData,
      });
    }
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
