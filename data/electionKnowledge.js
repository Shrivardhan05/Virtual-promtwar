export const timeline = [
  { phase: "Voter registration window", detail: "Check eligibility, register, and verify voter record." },
  { phase: "Candidate & campaign period", detail: "Review manifestos, debates, and local issues." },
  { phase: "Early/absentee voting", detail: "Submit mail ballots or vote early if available." },
  { phase: "Election day", detail: "Vote at assigned location or approved mode." },
  { phase: "Counting & results", detail: "Ballots are validated and counted before certification." },
];

export const faq = [
  {
    keys: ["first-time", "first time", "start", "new voter"],
    answer: "Start by checking eligibility, registering, confirming your registration, and understanding ID/ballot rules in your area."
  },
  {
    keys: ["absentee", "mail", "postal"],
    answer: "Absentee/mail voting usually requires requesting a ballot, completing it carefully, and returning it before the deadline."
  },
  {
    keys: ["id", "document", "proof"],
    answer: "Keep a photo ID (if required), proof of address (if needed), and your voter registration confirmation handy."
  },
  {
    keys: ["deadline", "last date", "timeline"],
    answer: "Deadlines vary by location. Check official election authority websites for exact dates in your district."
  }
];

export const quiz = [
  {
    q: "What should generally be done first?",
    options: ["Vote directly", "Register/check registration", "Wait for election day"],
    correct: 1
  },
  {
    q: "Which is important for absentee voting?",
    options: ["Ignoring return dates", "Returning ballot before deadline", "No verification needed"],
    correct: 1
  }
];
