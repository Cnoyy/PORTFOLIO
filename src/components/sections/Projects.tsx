"use client";

import { ExternalLink, Github, Folder } from "lucide-react";
import { Section, Card, Button } from "../ui";

const featuredProjects = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-featured e-commerce platform with real-time inventory management, payment processing, and admin dashboard. Built with Next.js, Stripe, and PostgreSQL.",
    image: "/project-1.jpg",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    title: "Task Management App",
    description:
      "A collaborative task management application with real-time updates, team workspaces, and advanced filtering. Features drag-and-drop functionality and notifications.",
    image: "/project-2.jpg",
    tags: ["React", "Node.js", "Socket.io", "MongoDB", "Redux"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    title: "AI Content Generator",
    description:
      "An AI-powered content generation tool that helps create blog posts, social media content, and marketing copy using OpenAI's GPT API.",
    image: "/project-3.jpg",
    tags: ["Next.js", "OpenAI API", "Prisma", "Vercel AI SDK"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
];

const otherProjects = [
  {
    title: "Weather Dashboard",
    description: "Real-time weather app with location-based forecasts and interactive maps.",
    tags: ["React", "OpenWeather API", "Chart.js"],
    githubUrl: "https://github.com",
  },
  {
    title: "Portfolio Template",
    description: "A customizable portfolio template for developers with dark mode support.",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com",
  },
  {
    title: "Chat Application",
    description: "Real-time chat app with private messaging and group channels.",
    tags: ["React", "Firebase", "WebRTC"],
    githubUrl: "https://github.com",
  },
  {
    title: "Budget Tracker",
    description: "Personal finance app with expense tracking and visual analytics.",
    tags: ["Vue.js", "Node.js", "D3.js"],
    githubUrl: "https://github.com",
  },
  {
    title: "Recipe Finder",
    description: "Search and save recipes with nutritional information and meal planning.",
    tags: ["React", "Spoonacular API", "Redux"],
    githubUrl: "https://github.com",
  },
  {
    title: "URL Shortener",
    description: "Custom URL shortening service with analytics and QR code generation.",
    tags: ["Node.js", "Redis", "PostgreSQL"],
    githubUrl: "https://github.com",
  },
];

export default function Projects() {
  return (
    <Section
      id="projects"
      title="Featured Projects"
      subtitle="A selection of my recent work and personal projects"
      className="bg-slate-50 dark:bg-slate-900/50"
    >
      {/* Featured Projects */}
      <div className="space-y-12 mb-20">
        {featuredProjects.map((project, index) => (
          <Card key={project.title} className="overflow-hidden" hover={false}>
            <div
              className={`grid lg:grid-cols-2 gap-0 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Project Image */}
              <div
                className={`relative h-64 lg:h-auto bg-gradient-to-br from-blue-600 to-indigo-600 ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center text-white/20">
                  <Folder size={120} />
                </div>
              </div>

              {/* Project Info */}
              <div className="p-8 lg:p-10">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {project.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-4">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                  >
                    <ExternalLink size={18} />
                    Live Demo
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                  >
                    <Github size={18} />
                    Source Code
                  </a>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Other Projects */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-10">
          Other Noteworthy Projects
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherProjects.map((project) => (
            <Card key={project.title} className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <Folder
                  size={40}
                  className="text-blue-600 dark:text-blue-400"
                />
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label="View source code"
                >
                  <Github size={22} />
                </a>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {project.title}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-grow">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-slate-500 dark:text-slate-400 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <Button variant="outline" size="lg">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Github size={20} />
            View All Projects on GitHub
          </a>
        </Button>
      </div>
    </Section>
  );
}
