/**
 * Every word, number and photo reference on the site lives here.
 * Editing content should never mean opening a component.
 */

export const org = {
  name: 'May Foundation',
  tagline: 'Hope begins here',
  location: 'Gujarat, India',
  founded: 2024,
  email: 'mayfoundation.in@gmail.com',
  phone: '+91 6351 081850',
  phoneHref: '+916351081850',
  instagram: 'https://www.instagram.com/may.foundation/',
  instagramHandle: '@may.foundation',
  registerUrl: 'https://tinyurl.com/mayfoundation',
} as const

export const nav = [
  { label: 'Mission', href: '#mission' },
  { label: 'Impact', href: '#impact' },
  { label: 'Work', href: '#work' },
  { label: 'Field notes', href: '#field' },
  { label: 'Team', href: '#team' },
] as const

export const hero = {
  eyebrow: 'Youth-led nonprofit · Gujarat, India',
  headline: ['Hope begins', 'here.'],
  body: 'We are a group of students who turn up, week after week, for the families living a few streets away. Classrooms on the floor. Hygiene kits in hand. Nothing abstract.',
  primaryCta: 'Donate',
  secondaryCta: 'Volunteer with us',
  /** Photos in the hero stack, back to front. */
  stack: ['3', '7', '10'],
} as const

export const mission = {
  eyebrow: 'What we believe',
  /** Revealed word by word on scroll. Keep it to one sentence. */
  statement:
    'Change does not arrive. It is carried there, by people who keep showing up.',
  supporting: [
    {
      title: 'We work where we live',
      body: 'Every programme runs within reach of the volunteers who deliver it. We can be there next week, and the week after.',
    },
    {
      title: 'Students, not spectators',
      body: 'The foundation is run entirely by young people. Teaching, logistics, fundraising, follow-up — all of it.',
    },
    {
      title: 'Small, repeated, real',
      body: 'We would rather serve one neighbourhood properly for years than a hundred once for a photograph.',
    },
  ],
} as const

export const impact = {
  eyebrow: 'The number that matters',
  /** The signature figure. Each unit is drawn as one mark in the canvas field. */
  headline: 12942,
  headlineLabel: 'people reached since we started',
  caption: 'Every mark is one person.',
  /** `count: false` renders the value as-is instead of animating up to it. */
  stats: [
    { value: 12, label: 'Volunteers on the ground', count: true },
    { value: 4, label: 'Active programmes', count: true },
    { value: 2024, label: 'Running since', count: false },
  ],
} as const

export const programs = [
  {
    name: 'Educational empowerment',
    summary:
      'Tools, mentorship and scholarships for children who are already behind before they start.',
    detail:
      'Volunteers run weekly sessions wherever there is floor space — homework support, reading, and the small administrative help that keeps a child enrolled.',
    photo: '3',
  },
  {
    name: "Women's hygiene",
    summary:
      'Menstrual hygiene awareness, honest conversation, and products in hand.',
    detail:
      'Sessions are run by our women volunteers, in local language, in rooms where the questions can actually be asked.',
    photo: '5',
  },
  {
    name: 'Financial literacy',
    summary:
      'Saving, budgeting and the basics of running a small business, for youth and families.',
    detail:
      'Practical, not theoretical: what a bank account does, what interest costs, how to price what you sell.',
    photo: '8',
  },
  {
    name: 'Community development',
    summary:
      'Clean-up drives, health camps, infrastructure repair and sustainability work.',
    detail:
      'The unglamorous list. It is also the work neighbourhoods ask us for most often.',
    photo: '11',
  },
] as const

/** Field gallery, in the order they appear on the rail. */
export const gallery = [
  '3',
  '1',
  '7',
  '2',
  '10',
  '4',
  '9',
  '5',
  '11',
  '6',
  '8',
  'post0',
  'post2',
  'post3',
  'post4',
  'post5',
  'post6',
  'post7',
  'post8',
  'post1',
] as const

export const team = {
  eyebrow: 'The people behind it',
  title: 'Founders',
  body: 'Introductions, in their own words, from the foundation’s Instagram.',
  /** Instagram post permalinks. Embeds initialise only when scrolled into view. */
  posts: [
    'https://www.instagram.com/p/DJHpcBusBZm/',
    'https://www.instagram.com/p/DJHpeKMMOfu/',
    'https://www.instagram.com/p/DJHpgOts04U/',
  ],
} as const

export const involve = {
  eyebrow: 'Two ways in',
  title: 'Turn up, or send what you can.',
  body: 'Volunteering is the one we need most. Donations buy the notebooks, the kits and the camps.',
  donate: {
    title: 'Donate',
    body: 'Scan the code with any UPI app. Every rupee goes to programme costs.',
    cta: 'Show the QR code',
  },
  volunteer: {
    title: 'Volunteer',
    body: 'Two hours a week is enough to matter. We will find you a place.',
    cta: 'Register to volunteer',
  },
} as const
