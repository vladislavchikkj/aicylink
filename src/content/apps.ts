// Content for the /apps/[slug] pages. Each entry extends a product from site.ts.
// Keep it honest: apps in development describe what they will do, with no made-up stats.

import { categories, type AppId, type Product } from "./site";

export type AppDetails = {
  /** URL segment: /apps/<slug> */
  slug: string;
  /** Search-friendly page title, e.g. "AI calorie counter from a photo" */
  seoTitle: string;
  headline: string;
  intro: string;
  features: { title: string; text: string }[];
  steps: string[];
  faq: { q: string; a: string }[];
};

export const appDetails: Record<AppId, AppDetails> = {
  lummie: {
    slug: "lummie",
    seoTitle: "Call an AI and talk about anything",
    headline: "Call an AI. Talk about anything.",
    intro: "Lummie is a voice app: pick an AI character, press call and just talk — vent after a long day, practice a language or rehearse a job interview. It listens and answers out loud, like a real call.",
    features: [
      { title: "Four characters", text: "Mia, Leo, Ava and Sam — each with their own voice and personality." },
      { title: "Real voice calls", text: "Speak naturally and hear a reply in about a second." },
      { title: "Any language", text: "Start in any major language and switch mid-call." },
      { title: "Text chat too", text: "Can't talk out loud? Chat with the same characters." },
    ],
    steps: ["Open lummie.app — no install needed.", "Pick who to talk to and what about.", "Press call and start talking."],
    faq: [
      { q: "Is Lummie free?", a: "Your first 3 minutes of calls and 10 chat messages are free, no card needed. Weekly, monthly and yearly plans add more speaking time — see pricing on lummie.app." },
      { q: "Are my calls recorded?", a: "No. Lummie does not save the audio of your calls. Text chats are saved so you can pick up where you left off." },
      { q: "Do I need to install anything?", a: "No. Lummie runs in your browser on desktop and mobile — you only need a microphone." },
      { q: "Who makes Lummie?", a: "Lummie is built and run by AicyLink, an independent product studio." },
    ],
  },
  cv: {
    slug: "tailra",
    seoTitle: "AI resume tailoring for every job application",
    headline: "A resume that fits every job.",
    intro: "Paste a job post and Tailra rewrites your resume to match it — the right keywords, the right experience up front, in your own voice.",
    features: [
      { title: "Match score", text: "See how well your resume fits a role before you apply." },
      { title: "Keyword boost", text: "Surfaces the skills recruiters and ATS systems look for." },
      { title: "Your voice", text: "Rewrites stay truthful and sound like you, not a robot." },
      { title: "One-click PDF", text: "Export a clean, recruiter-friendly resume in seconds." },
    ],
    steps: ["Upload your current resume.", "Paste a link or text of the job post.", "Review the tailored version and export."],
    faq: [
      { q: "When does Tailra launch?", a: "Tailra is in development. Join the waitlist and we'll email you as soon as early access opens." },
      { q: "Will it invent experience I don't have?", a: "No. Tailra only reorders and rephrases what is already true in your resume." },
      { q: "Does it work with ATS systems?", a: "Yes — exports use simple, ATS-friendly formatting." },
    ],
  },
  snap: {
    slug: "platey",
    seoTitle: "AI calorie counter from a photo",
    headline: "Snap your meal. Know your macros.",
    intro: "Take a photo of anything you eat and Platey estimates calories, protein, carbs and fat in seconds — no searching, no weighing, no typing.",
    features: [
      { title: "Photo to calories", text: "Point, shoot and get an instant nutrition estimate." },
      { title: "Daily rings", text: "Track calories and macros against your personal goals." },
      { title: "Smart corrections", text: "Adjust portions with a tap and Platey learns your habits." },
      { title: "Weekly insights", text: "Spot patterns and get simple suggestions that stick." },
    ],
    steps: ["Tell Platey your goal — lose, maintain or gain.", "Snap a photo of every meal.", "Watch your daily rings and weekly trends."],
    faq: [
      { q: "When does Platey launch?", a: "Platey is one of our next launches. Join the waitlist to get early access first." },
      { q: "How accurate is a photo estimate?", a: "Estimates are a guide, not a lab test. You can always adjust portions to make them more precise." },
      { q: "Is Platey a medical app?", a: "No. Platey is for everyday wellness tracking, not for diagnosing or treating any condition." },
    ],
  },
  glow: {
    slug: "glowie",
    seoTitle: "AI glow-up plan for skin, style and hair",
    headline: "Your personal glow-up plan.",
    intro: "Glowie looks at a selfie and your goals, then builds a simple daily routine for skin, hair and style — and keeps you on track.",
    features: [
      { title: "Selfie analysis", text: "Understands your skin type, face shape and features." },
      { title: "Daily routine", text: "A short checklist you can actually stick to." },
      { title: "Style ideas", text: "Haircuts, colors and looks that suit you." },
      { title: "Progress photos", text: "See your glow-up week by week." },
    ],
    steps: ["Take a selfie and pick your goals.", "Get your personal plan.", "Check off your routine and track progress."],
    faq: [
      { q: "When does Glowie launch?", a: "Glowie is in development. Join the waitlist and we'll let you know when early access opens." },
      { q: "What happens to my photos?", a: "Photos are used only to build your plan and are never sold or shared." },
      { q: "Is this medical advice?", a: "No. Glowie gives general beauty and wellness suggestions, not dermatological advice." },
    ],
  },
  move: {
    slug: "wallie",
    seoTitle: "Wall pilates and somatic workouts at home",
    headline: "Wall pilates, made for you.",
    intro: "Short, low-impact wall pilates and somatic workouts you can do at home — personalized to your level, goals and schedule.",
    features: [
      { title: "28-day plans", text: "A clear plan that adapts as you get stronger." },
      { title: "10–20 minutes", text: "Workouts that fit into any day." },
      { title: "Just a wall", text: "No gym, no equipment, no jumping." },
      { title: "Somatic recovery", text: "Gentle sessions for stress, posture and sleep." },
    ],
    steps: ["Answer a short quiz about your goals.", "Get your personal plan.", "Follow guided sessions and track streaks."],
    faq: [
      { q: "When does Wallie launch?", a: "Wallie is in development. Join the waitlist to get early access." },
      { q: "Is wall pilates good for beginners?", a: "Yes. Using the wall for support makes exercises easier to learn and gentle on joints." },
      { q: "Do I need equipment?", a: "No — just a free wall and a mat or soft floor." },
    ],
  },
  learn: {
    slug: "nibble",
    seoTitle: "Five-minute daily lessons on AI, money and focus",
    headline: "Get smarter in five minutes a day.",
    intro: "Nibble turns big topics — AI, personal finance, focus — into bite-sized interactive lessons you can finish on a coffee break.",
    features: [
      { title: "Bite-sized lessons", text: "Five minutes, one idea, one quick quiz." },
      { title: "Streaks", text: "Build a daily learning habit that sticks." },
      { title: "Practical topics", text: "AI tools, money basics, productivity and more." },
      { title: "Your pace", text: "Lessons adapt to what you already know." },
    ],
    steps: ["Pick the topics you care about.", "Do one short lesson a day.", "Keep your streak and level up."],
    faq: [
      { q: "When does Nibble launch?", a: "Nibble is in development. Join the waitlist and we'll email you when it's ready." },
      { q: "Do I need any background?", a: "No. Every course starts from zero and builds up step by step." },
      { q: "How long is a lesson?", a: "About five minutes." },
    ],
  },
  stars: {
    slug: "lunara",
    seoTitle: "AI astrology, birth chart and tarot readings",
    headline: "Your stars, read by AI.",
    intro: "Lunara builds your birth chart and turns it into daily horoscopes, compatibility insights and tarot readings that feel personal — not generic.",
    features: [
      { title: "Birth chart", text: "Your full natal chart, explained in plain language." },
      { title: "Daily horoscope", text: "A short, personal reading every morning." },
      { title: "Tarot", text: "Draw cards and get a reading for your question." },
      { title: "Compatibility", text: "See how your chart matches with friends and partners." },
    ],
    steps: ["Enter your birth date, time and place.", "Explore your chart and today's reading.", "Ask the cards anything."],
    faq: [
      { q: "When does Lunara launch?", a: "Lunara is one of our next launches. Join the waitlist to be among the first users." },
      { q: "Do I need my exact birth time?", a: "It helps for rising sign and houses, but Lunara works without it too." },
      { q: "Is it for entertainment?", a: "Yes — Lunara is for reflection and fun, not for medical, legal or financial decisions." },
    ],
  },
  dreams: {
    slug: "dreamie",
    seoTitle: "AI dream journal and dream interpretation",
    headline: "Understand your dreams.",
    intro: "Write or say what you dreamed and Dreamie interprets the symbols, tracks recurring themes and links them to how you feel.",
    features: [
      { title: "Voice journal", text: "Record a dream in seconds right after waking up." },
      { title: "Interpretations", text: "Symbols and themes explained in a thoughtful way." },
      { title: "Patterns", text: "See recurring dreams and moods over time." },
      { title: "Private by default", text: "Your journal is yours alone." },
    ],
    steps: ["Record your dream by voice or text.", "Read your interpretation.", "Discover patterns over weeks."],
    faq: [
      { q: "When does Dreamie launch?", a: "Dreamie is in development. Join the waitlist to get early access." },
      { q: "Is my dream journal private?", a: "Yes. Entries are never shared or used for advertising." },
      { q: "Is this therapy?", a: "No. Dreamie is a reflection tool and not a substitute for professional help." },
    ],
  },
};

export type AppEntry = Product & AppDetails;

export const allApps: AppEntry[] = categories.flatMap((c) => c.products).map((p) => ({ ...p, ...appDetails[p.id] }));

export const appHref = (id: AppId) => `/apps/${appDetails[id].slug}`;

export const findApp = (slug: string) => allApps.find((a) => a.slug === slug);
