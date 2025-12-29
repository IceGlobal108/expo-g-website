import { getDb } from "../src/db/mongo";

const templates = [
  {
    slug: "welcome",
    type: "email",
    title: "Welcome to ICE",
    subject: "Welcome to ICE Exhibitions",
    body: "Hi {{name}},\n\nThanks for reaching out to ICE Exhibitions. Our team will review your request and get back within 24 hours.\n\nCheers,\nICE Team",
    placeholders: ["name"],
    description: "Generic welcome email for new inquiries.",
  },
  {
    slug: "password-reset",
    type: "email",
    title: "Password Reset",
    subject: "Reset your ICE password",
    body: "Hi {{name}},\n\nWe received a request to reset your password. Use this link: {{reset_link}}\nIf you didn’t request this, you can ignore this email.\n\nThanks,\nICE Security",
    placeholders: ["name", "reset_link"],
    description: "Password reset flow.",
  },
  {
    slug: "event-rsvp",
    type: "email",
    title: "Event RSVP Confirmation",
    subject: "You’re confirmed for {{event_name}}",
    body: "Hi {{name}},\n\nYour RSVP for {{event_name}} is confirmed.\nDate: {{event_date}}\nLocation: {{event_location}}\n\nWe’ll send reminders before the event.\n\nThanks,\nICE Events",
    placeholders: ["name", "event_name", "event_date", "event_location"],
    description: "Confirmation for event RSVPs.",
  },
  {
    slug: "event-update",
    type: "email",
    title: "Event Update",
    subject: "Update for {{event_name}}",
    body: "Hi {{name}},\n\nThere’s an update for {{event_name}}:\n{{update_body}}\n\nSee you soon,\nICE Events",
    placeholders: ["name", "event_name", "update_body"],
    description: "Notifications for schedule/venue/content changes.",
  },
  {
    slug: "seller-submission",
    type: "email",
    title: "Seller submission received",
    subject: "We received your seller submission",
    body: "Hi {{name}},\n\nThanks for sharing your seller story for {{company}}. We’ll review and publish after QA.\n\nTrack status in your dashboard or reply to this email with questions.\n\nThanks,\nICE Team",
    placeholders: ["name", "company"],
    description: "Receipt for seller submissions.",
  },
  {
    slug: "buyer-submission",
    type: "email",
    title: "Buyer submission received",
    subject: "We received your buyer story",
    body: "Hi {{name}},\n\nThanks for submitting your buyer journey. Our editors will review and reach out if we need more details.\n\nCheers,\nICE Team",
    placeholders: ["name"],
    description: "Receipt for buyer stories/journeys.",
  },
  {
    slug: "admin-alert-upload",
    type: "email",
    title: "New asset uploaded",
    subject: "New gallery upload: {{title}}",
    body: "Team,\n\nA new gallery item was uploaded by {{uploaded_by}}.\nTitle: {{title}}\nCategory: {{category}}\n\nReview in admin before publishing.",
    placeholders: ["uploaded_by", "title", "category"],
    description: "Internal alert for new gallery uploads.",
  },
  {
    slug: "admin-alert-delete",
    type: "email",
    title: "Content deleted",
    subject: "Content deleted: {{entity}}",
    body: "Team,\n\n{{entity}} was deleted by {{deleted_by}} at {{deleted_at}}.\nIf this was unexpected, please review activity logs.",
    placeholders: ["entity", "deleted_by", "deleted_at"],
    description: "Internal deletion notification.",
  },
  {
    slug: "welcome-platform",
    type: "email",
    title: "Welcome to the platform",
    subject: "You’re in. Let’s get started.",
    body: "Hi {{name}},\n\nWelcome to ICE Exhibitions digital. You can manage submissions, track leads, and update content.\n\nNeed help? Reply to this email or visit our help center.\n\nThanks,\nICE Team",
    placeholders: ["name"],
    description: "Platform onboarding welcome for new admin/editor accounts.",
  },
  {
    slug: "otp",
    type: "sms",
    title: "One-Time Passcode",
    subject: "",
    body: "Your ICE verification code is {{code}}. It expires in 10 minutes.",
    placeholders: ["code"],
    description: "SMS OTP template for sign-in or sensitive actions.",
  },
  {
    slug: "contact-confirmation",
    type: "email",
    title: "Contact Confirmation",
    subject: "We received your contact request",
    body: "Hi {{name}},\n\nWe received your contact request about \"{{subject}}\". We’ll reply soon at {{email}}.\n\nThanks,\nICE Support",
    placeholders: ["name", "subject", "email"],
    formSlug: "contact",
    description: "Auto-response for contact form submissions.",
  },
  {
    slug: "partner-inquiry",
    type: "email",
    title: "Partner Inquiry",
    subject: "Thanks for your partner inquiry",
    body: "Hi {{name}},\n\nThanks for your interest in partnering with ICE Exhibitions. We’ll review your details and follow up with next steps.\n\nBest,\nPartnerships @ ICE",
    placeholders: ["name"],
    formSlug: "partner",
    description: "Response for partner inquiries.",
  },
  {
    slug: "sponsor-inquiry",
    type: "email",
    title: "Sponsor Inquiry",
    subject: "Sponsorship inquiry received",
    body: "Hi {{name}},\n\nAppreciate your interest in sponsoring ICE. We’ll reach out to discuss packages and availability.\n\nRegards,\nSponsorships @ ICE",
    placeholders: ["name"],
    formSlug: "sponsor",
    description: "Response for sponsorship inquiries.",
  },
  {
    slug: "brand-guidelines",
    type: "email",
    title: "Brand Guidelines Request",
    subject: "Your brand guidelines request",
    body: "Hi {{name}},\n\nHere’s the link to download our brand guidelines: {{guidelines_link}}.\n\nLet us know if you need assets or formats.\n\nThanks,\nICE Brand Team",
    placeholders: ["name", "guidelines_link"],
    formSlug: "brand-guidelines",
    description: "Delivers brand guidelines link to requesters.",
  },
  {
    slug: "feedback-thank-you",
    type: "email",
    title: "Feedback Thank You",
    subject: "Thanks for your feedback",
    body: "Hi {{name}},\n\nThanks for sharing feedback about ICE Exhibitions. We value your input and will use it to improve the next edition.\n\nThanks,\nICE Team",
    placeholders: ["name"],
    formSlug: "feedback",
    description: "Acknowledges feedback submissions.",
  },
  {
    slug: "form-receipt",
    type: "email",
    title: "Form submission received",
    subject: "We received your submission",
    body: "Hi {{name}},\n\nWe received your submission for {{form}}. Our team will review and get back to you shortly.\n\nCheers,\nICE Team",
    placeholders: ["name", "form"],
    description: "Generic receipt template for any form.",
  },
  {
    slug: "lead-notification",
    type: "email",
    title: "New lead notification",
    subject: "New lead captured: {{name}}",
    body: "Team,\n\nA new lead was captured from {{form}}.\nName: {{name}}\nEmail: {{email}}\nCompany: {{company}}\n\nView in admin for full details.",
    placeholders: ["form", "name", "email", "company"],
    description: "Internal notification for new leads.",
  },
];

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection("templates");
    await col.deleteMany({});
    await col.insertMany(templates.map((t) => ({ ...t, createdAt: new Date(), updatedAt: new Date() })));
    console.log("Templates seed applied.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();
