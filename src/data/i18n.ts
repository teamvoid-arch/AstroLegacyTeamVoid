import { useStore } from '../store';

// UI strings in English and Bangla. Bangla is a first draft by the AI coding
// tool and MUST be reviewed by a native speaker before submission (see AI_USE.md).
// Story captions are English-only until the native-speaker translation is added;
// in Bangla mode the UI switches and captions say so.

const en = {
  challenge: 'NASA Space Apps Challenge 2026 · Abandoned but not Forgotten',
  tagline: 'Old machines are not junk. Each one changed what we know, and many still talk to us.',
  begin: 'Begin the Story',
  continue: 'Continue where you left off',
  experience: 'Experience Hardwares',
  flow: 'Rooftop|Moon|Mars|Deep space|Home',
  logbook: 'Logbook',
  sources: 'Sources',
  about: 'About',
  teachers: 'For parents & teachers',
  data: 'NASA data',
  settings: 'Menu',
  explore: 'Explore',
  soundOn: 'Sound on',
  soundOff: 'Sound off',
  play: 'Play',
  pause: 'Pause',
  replay: 'Replay line',
  keepGoing: 'Keep going',
  sideTrips: 'Side trips',
  close: 'Close',
  back: 'Back',
  status: 'Status today',
  found: 'What it found',
  source: 'NASA source',
  spin: 'Spin it in 3D',
  seeStory: 'See it in the story',
  tryIt: 'Try it yourself',
  breakTitle: 'Good place for a break',
  breakText: 'Your progress is saved on this device. Come back any time.',
  stopHere: 'Stop here',
  nameAsk: 'What should I call you?',
  nameHint: 'First name only. It stays on this device and is never sent anywhere.',
  skip: 'Skip',
  save: 'Save',
  welcomeBack: 'Welcome back, space buddy! I missed you!',
  leaving: 'You are leaving Astro Legacy to visit a NASA (or partner) website. Open it?',
  realPhoto: 'Real NASA photo',
  illustration: 'NASA illustration',
  modelNasa: 'NASA 3D model',
  modelOwn: 'Replica by Team VOID (not a NASA model)',
  silentNote: 'Space is silent. Music and sound effects are added for the story.',
  captionsBn: '',
  scrollHint: 'Scroll, swipe or press ↓ to fly on',
  stamps: 'stamps',
  music: 'Music', voice: 'Voice', effects: 'Effects', captions: 'Captions',
  reducedMotion: 'Reduced motion', lite: 'Lite mode (faster on phones)', reset: 'Reset progress',
  language: 'Language',
  imagined: 'Imagined control room',
  basedOn: 'Based on NASA data · simplified simulation',
  loading: 'VIMO is juggling stars while this part loads…',
  noWebgl: 'Your browser can’t show 3D right now, so you’ll see the story with real NASA photos instead.',
};

type Dict = typeof en;

const bn: Dict = {
  challenge: 'নাসা স্পেস অ্যাপস চ্যালেঞ্জ ২০২৬ · পরিত্যক্ত, কিন্তু ভুলে যাওয়া নয়',
  tagline: 'পুরোনো যন্ত্র আবর্জনা নয়। প্রতিটি যন্ত্র আমাদের জ্ঞান বদলে দিয়েছে, আর অনেকগুলো এখনও আমাদের সাথে কথা বলে।',
  begin: 'গল্প শুরু করো',
  continue: 'যেখানে থেমেছিলে সেখান থেকে',
  experience: 'হার্ডওয়ার এক্সপেরিয়েন্স',
  flow: 'ছাদ|চাঁদ|মঙ্গল|গভীর মহাকাশ|বাড়ি',
  logbook: 'লগবুক',
  sources: 'তথ্যসূত্র',
  about: 'পরিচিতি',
  teachers: 'অভিভাবক ও শিক্ষকদের জন্য',
  data: 'নাসার তথ্য',
  settings: 'মেনু',
  explore: 'ঘুরে দেখো',
  soundOn: 'শব্দ চালু',
  soundOff: 'শব্দ বন্ধ',
  play: 'চালাও',
  pause: 'থামাও',
  replay: 'আবার শোনো',
  keepGoing: 'এগিয়ে চলো',
  sideTrips: 'ছোট ভ্রমণ',
  close: 'বন্ধ করো',
  back: 'ফিরে যাও',
  status: 'আজকের অবস্থা',
  found: 'যা খুঁজে পেয়েছে',
  source: 'নাসার তথ্যসূত্র',
  spin: '৩ডি-তে ঘুরিয়ে দেখো',
  seeStory: 'গল্পে দেখো',
  tryIt: 'নিজে চেষ্টা করো',
  breakTitle: 'বিরতি নেওয়ার ভালো সময়',
  breakText: 'তোমার অগ্রগতি এই ডিভাইসেই সংরক্ষিত আছে। যখন খুশি ফিরে এসো।',
  stopHere: 'এখানে থামো',
  nameAsk: 'তোমাকে কী নামে ডাকব?',
  nameHint: 'শুধু প্রথম নাম। এটি এই ডিভাইসেই থাকে, কোথাও পাঠানো হয় না।',
  skip: 'বাদ দাও',
  save: 'সংরক্ষণ করো',
  welcomeBack: 'আবার স্বাগতম, মহাকাশ বন্ধু! তোমাকে মিস করেছি!',
  leaving: 'তুমি অ্যাস্ট্রো লিগেসি ছেড়ে নাসার (বা সহযোগী) ওয়েবসাইটে যাচ্ছ। খুলব?',
  realPhoto: 'নাসার আসল ছবি',
  illustration: 'নাসার আঁকা ছবি',
  modelNasa: 'নাসার ৩ডি মডেল',
  modelOwn: 'টিম ভয়েডের তৈরি রেপ্লিকা (নাসার মডেল নয়)',
  silentNote: 'মহাকাশে কোনো শব্দ নেই। গল্পের জন্য সংগীত ও শব্দ যোগ করা হয়েছে।',
  captionsBn: 'গল্পের বাংলা ক্যাপশন অনুবাদ চলছে; আপাতত ইংরেজি দেখানো হচ্ছে।',
  scrollHint: 'এগোতে স্ক্রল করো, সোয়াইপ করো বা ↓ চাপো',
  stamps: 'স্ট্যাম্প',
  music: 'সংগীত', voice: 'কণ্ঠ', effects: 'শব্দ প্রভাব', captions: 'ক্যাপশন',
  reducedMotion: 'কম নড়াচড়া', lite: 'লাইট মোড (ফোনে দ্রুত)', reset: 'অগ্রগতি মুছে ফেলো',
  language: 'ভাষা',
  imagined: 'কল্পিত নিয়ন্ত্রণ কক্ষ',
  basedOn: 'নাসার তথ্যের ভিত্তিতে · সরল সিমুলেশন',
  loading: 'এই অংশটি লোড হওয়ার সময় ভিমো তারা নিয়ে খেলছে…',
  noWebgl: 'তোমার ব্রাউজার এখন ৩ডি দেখাতে পারছে না, তাই গল্পটি নাসার আসল ছবি দিয়ে দেখানো হবে।',
};

const dicts = { en, bn };

export function useT() {
  const lang = useStore((s) => s.lang);
  return (k: keyof Dict) => dicts[lang][k] || en[k];
}

export function personalise(text: string, name: string) {
  return name ? text.replace(/space buddy/g, name) : text;
}
