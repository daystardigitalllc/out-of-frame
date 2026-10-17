// ===== OUT OF FRAME - site settings. Edit this file; no other code changes needed. =====
window.OOF = {
  phone: "615-686-7495",
  phoneHref: "tel:+16156867495",
  email: "Dan@outofframestudios.com",
  location: "Springfield, TN",

  // YouTube source video
  videoId: "2kXzLd9Pm9M",

  // Hero background: video/hero.mp4 (film clips 0:05-0:10, 2:01-2:06, 4:05-4:10, 5:55-6:00)

  // Highlight tiles: looping preview file + where the full film starts when clicked (seconds)
  reel: [
    { title: "The Ceremony",       src: "video/clip1.mp4", poster: "video/clip1.jpg", start: 116 },
    { title: "The Details",        src: "video/clip2.mp4", poster: "video/clip2.jpg", start: 233 },
    { title: "The Celebration", src: "video/clip3.mp4", poster: "video/clip3.jpg", start: 349 }
  ],

  // Contact form: with no id set, the form opens an email to Dan@outofframestudios.com instead.
  // For direct delivery, create a free form at https://formspree.io and paste the form id (the part after /f/)
  formspreeId: "",

  // Deposits: create a Stripe Payment Link (https://dashboard.stripe.com/payment-links) and paste it here
  depositUrl: "https://buy.stripe.com/aFa7sM3e86Jz6BM6uc5EY00"
};
