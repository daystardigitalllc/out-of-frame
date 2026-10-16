// ===== OUT OF FRAME — site settings. Edit this file; no other code changes needed. =====
window.OOF = {
  phone: "615-686-7495",
  phoneHref: "tel:+16156867495",
  email: "Dan@outofframemedia.com",
  location: "Springfield, TN",

  // YouTube source video
  videoId: "2kXzLd9Pm9M",

  // Hero background loop: the clips cycle (seconds into the video)
  heroSegments: [
    { start: 45,  end: 70 },
    { start: 150, end: 175 },
    { start: 300, end: 325 }
  ],

  // Highlight reel tiles (seconds into the video)
  reel: [
    { title: "The Ceremony",   tag: "Moments",  start: 116, end: 130 },
    { title: "The Details",    tag: "Cinema",   start: 233, end: 247 },
    { title: "The Celebration",tag: "Natural audio", start: 349, end: 363 }
  ],

  // Contact form: with no id set, the form opens an email to Dan@outofframemedia.com instead.
  // For direct delivery, create a free form at https://formspree.io and paste the form id (the part after /f/)
  formspreeId: "",

  // Deposits: create a Stripe Payment Link (https://dashboard.stripe.com/payment-links) and paste it here
  depositUrl: ""
};
