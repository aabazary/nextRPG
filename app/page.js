import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Welcome to NextRPG</title>
        <meta name="description" content="Welcome to NextRPG, an exciting adventure game where you gather resources, fight mobs, complete quests, and progress through tiers!" />
      </Head>

      <main className="bg-white text-textDark min-h-screen">
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="text-center">
            <h1 className="text-4xl font-extrabold text-secondary mb-4">
              Welcome to NextRPG
            </h1>
            <p className="text-lg text-textDark mb-6">
              Embark on an epic journey where you gather resources, defeat mobs, complete challenging quests, and unlock the next tier of your adventure. Are you ready to conquer all 10 tiers and become a legend?
            </p>
            <div className="mt-6">
              <a
                href="/game-dashboard"
                className="bg-secondary text-textLight px-6 py-3 rounded-md font-medium shadow hover:bg-primary hover:shadow-lg transition-all duration-200"
              >
                Get Started
              </a>
            </div>
          </section>

          {/* Features Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-secondary mb-4">Game Features</h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-accent p-4 rounded-md shadow-md">
                  <h3 className="text-xl font-semibold text-primary">Gather Resources</h3>
                  <p className="text-textDark">
                    Play mini-games to collect valuable resources needed for your progression.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-accent  p-4 rounded-md shadow-md">
                  <h3 className="text-xl font-semibold text-primary">Grind Mobs</h3>
                  <p className="text-textDark">
                    Battle mobs to earn resources and prove your strength.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-accent  p-4 rounded-md shadow-md">
                  <h3 className="text-xl font-semibold text-primary">Complete Quests</h3>
                  <p className="text-textDark">
                    Answer challenging questions and defeat powerful foes to gather rewards.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-accent  p-4 rounded-md shadow-md">
                  <h3 className="text-xl font-semibold text-primary">Purchase Potions</h3>
                  <p className="text-textDark">
                    Buy healing potions to assist you in battles and keep your character alive.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Progression Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-secondary mb-4">Progress Through Tiers</h2>
            <p className="text-textDark mb-2">
              To progress, collect 20 of each tier's resources to upgrade your armor. Upgrading all pieces unlocks the next tier. Battle through all 10 tiers to complete the game and claim your title as the ultimate champion.
            </p>
          </section>

        </div>
      </main>
    </>
  );
}
