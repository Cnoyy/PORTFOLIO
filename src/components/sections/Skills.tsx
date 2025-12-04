"use client";

import { Section, Card } from "../ui";

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 95 },
      { name: "Vue.js", level: 80 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", level: 90 },
      { name: "Python", level: 85 },
      { name: "PostgreSQL", level: 85 },
      { name: "MongoDB", level: 80 },
    ],
  },
  {
    title: "Tools & Others",
    skills: [
      { name: "Git / GitHub", level: 95 },
      { name: "Docker", level: 80 },
      { name: "AWS / Vercel", level: 85 },
      { name: "Figma", level: 75 },
    ],
  },
];

const technologies = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vue.js",
  "Node.js",
  "Express",
  "Python",
  "Django",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "GraphQL",
  "REST API",
  "Docker",
  "Kubernetes",
  "AWS",
  "Vercel",
  "Git",
  "CI/CD",
  "Tailwind CSS",
  "Sass",
  "Figma",
  "Framer Motion",
];

export default function Skills() {
  return (
    <Section
      id="skills"
      title="Skills & Expertise"
      subtitle="Technologies and tools I work with to bring ideas to life"
    >
      {/* Skill Categories */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {skillCategories.map((category) => (
          <Card key={category.title} className="p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {category.title}
            </h3>
            <div className="space-y-4">
              {category.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {skill.name}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Technology Tags */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Technologies I Work With
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 text-sm font-medium hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}
