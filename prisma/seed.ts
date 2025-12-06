import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing articles
  await prisma.article.deleteMany({});

  // Create sample articles
  const articles = [
    {
      slug: "will-ai-replace-humans",
      title: "Will AI Replace Humans?",
      excerpt: "Exploring the future of AI and its impact on human jobs and society.",
      content:
        "Since late 2022 AI is on the rise and therefore many people worry whether AI will replace humans. The answer is not that simple. AI is a tool that can be used to automate tasks, but it can also be used to augment human capabilities. The future is not set in stone, but it is clear that AI will play a big role in the future. The question is how we will use it.\n\nAI technology has advanced rapidly in recent years, with breakthroughs in machine learning, natural language processing, and computer vision. These developments have led to both excitement and concern about the potential impact on employment and society as a whole.\n\nWhile some jobs may be automated, new opportunities will also emerge. The key is to adapt and learn new skills that complement AI technology rather than compete with it.",
      image: "/images/news/ai-robot.jpg",
      date: new Date("2024-07-01"),
      published: true,
    },
    {
      slug: "beaver-plague",
      title: "A Plague of Beavers",
      excerpt: "Beavers are building dams everywhere and flooding entire cities. What can we do?",
      content:
        "Beavers are taking over the world. They are building dams everywhere and flooding entire cities. What can we do to stop them?\n\nIn recent months, beaver populations have exploded in urban areas, causing significant infrastructure damage. These industrious creatures have been constructing dams in unexpected locations, leading to flooding in residential neighborhoods.\n\nWildlife experts are working on humane solutions to manage the beaver population while preserving their natural habitat. The challenge is finding a balance between protecting human infrastructure and respecting wildlife.",
      image: "/images/news/beaver.jpg",
      date: new Date("2024-05-01"),
      published: true,
    },
    {
      slug: "couple-cooking",
      title: "Spend More Time Together!",
      excerpt: "Cooking together is a great way to strengthen relationships and create lasting memories.",
      content:
        "Cooking together is a great way to spend more time with your partner. It is fun and you get to eat something delicious afterwards. What are you waiting for? Get cooking!\n\nResearch shows that couples who cook together report higher levels of relationship satisfaction. The shared activity promotes communication, teamwork, and creates opportunities for bonding.\n\nWhether you're making a simple pasta dish or attempting a complex recipe, the process of cooking together can be both challenging and rewarding. Plus, you'll have a delicious meal to enjoy at the end!",
      image: null,
      date: new Date("2024-03-01"),
      published: true,
    },
    {
      slug: "hiking",
      title: "Hiking is the Best!",
      excerpt: "Discover the physical and mental health benefits of hiking in nature.",
      content:
        "Hiking is a great way to get some exercise and enjoy the great outdoors. It is also a great way to clear your mind and reduce stress. So what are you waiting for? Get out there and start hiking!\n\nHiking offers numerous health benefits, including improved cardiovascular fitness, stronger muscles, and better mental health. Spending time in nature has been shown to reduce anxiety, depression, and stress levels.\n\nWhether you prefer gentle nature walks or challenging mountain trails, there's a hiking experience for everyone. Start with local trails and gradually work your way up to more challenging routes.",
      image: null,
      date: new Date("2024-01-01"),
      published: true,
    },
  ];

  for (const article of articles) {
    await prisma.article.create({
      data: article,
    });
  }

  console.log(`✅ Created ${articles.length} articles`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

