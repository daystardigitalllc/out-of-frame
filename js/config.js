// ===== OUT OF FRAME - site settings. Edit this file; no other code changes needed. =====
window.OOF = {
  phone: "615-686-7495",
  phoneHref: "tel:+16156867495",
  email: "Dan@outofframestudios.com",
  location: "Springfield, TN",

  // Hosted films (Cloudflare R2, served from our own domain)
  media: "https://media.outofframestudios.com",
  rayFilm: "ray-film.mp4",
  poseyFilm: "posey-film.mp4",

  // Hero background: video/hero.mp4 (film clips 0:05-0:10, 2:01-2:06, 4:05-4:10, 5:55-6:00)

  // Highlight tiles: looping preview file + where the full film starts when clicked (seconds)
  reel: [
    { title: "The Ceremony", src: "video/clip1.mp4", poster: "video/clip1.jpg", film: "rayFilm", start: 116 },
    { title: "The Details", src: "video/posey-details.mp4", poster: "video/posey-details.jpg", film: "poseyFilm", start: 99 },
    { title: "The Celebration", src: "video/posey-celebration.mp4", poster: "video/posey-celebration.jpg", film: "poseyFilm", start: 446 }
  ],

  // Contact form: Web3Forms access key (public by design). Inquiries are emailed to the recipient set in the Web3Forms dashboard.
  // Empty = the form falls back to opening an email to Dan.
  web3formsKey: "3738013a-5a23-4cbd-a5e7-cdc2cea29cd6",

  // Deposits: create a Stripe Payment Link (https://dashboard.stripe.com/payment-links) and paste it here
  depositUrl: "https://buy.stripe.com/aFa7sM3e86Jz6BM6uc5EY00"
};
