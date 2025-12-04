"use client";

import { Code2, Palette, Rocket, Users } from "lucide-react";
import { Section, Card } from "../ui";

const highlights = [
  {
    icon: Code2,
    title: "Clean Code",
    description: "Writing maintainable, scalable, and well-documented code",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Creating intuitive and visually appealing user interfaces",
  },
  {
    icon: Rocket,
    title: "Performance",
    description: "Optimizing applications for speed and efficiency",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Working effectively with teams and stakeholders",
  },
];

export default function About() {
  return (
    <Section
      id="about"
      title="About Me"
      subtitle="Get to know more about my background and what drives me"
      className="bg-slate-50 dark:bg-slate-900/50"
    >
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Image/Avatar Section */}
        <div className="relative">
          <div className="aspect-square max-w-md mx-auto relative">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl rotate-6 opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl -rotate-3 opacity-10" />

            {/* Main Card */}
            <Card className="relative h-full flex items-center justify-center p-8" hover={false}>
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold">
                  S
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Shinoy
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Full Stack Developer
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Content Section */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Passionate about building digital experiences
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            With over 5 years of experience in web development, I specialize in
            building modern, responsive web applications using cutting-edge
            technologies. My journey started with a curiosity for how things
            work on the internet, and it has evolved into a passion for creating
            impactful digital solutions.
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            I believe in continuous learning and staying updated with the latest
            industry trends. When I&apos;m not coding, you can find me exploring
            new technologies, contributing to open-source projects, or sharing
            knowledge with the developer community.
          </p>

          {/* Highlights Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50"
              >
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <item.icon size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
