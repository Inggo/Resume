// Background images per cube face, keyed by item/section name.
// Values are Cloudinary public IDs (no base URL, no extension).
//
// Faces with a single image set (no sub-items): bio, links
// Faces with per-item images: portfolio, work, education, skills

export default {
  // ─── Front face ────────────────────────────────────────────────────────────
  bio: [],

  // ─── Back face ─────────────────────────────────────────────────────────────
  links: [],

  // ─── Right face ────────────────────────────────────────────────────────────
  portfolio: {
    // University of the Philippines, Diliman
    "Dorm.Diliman": ["portfolio/dorm-diliman"],
    "Office of Student Housing Website": ["portfolio/osh-upd"],

    // Freelance Works
    "Mateship & Bayanihan": [
      "portfolio/mateship-main",
      "portfolio/mateship-section",
    ],
    "Taste of Australia": [
      "portfolio/taste-of-australia-1",
      "portfolio/taste-of-australia-2",
    ],
    "Stream & Sip Festival": [
      "portfolio/mateship-stream-sip",
      "portfoio/mateship-stream-sip-2",
    ],
    "Friuli Trattoria": ["portfolio/friuli-trattoria"],
    "Custom WordPress Themes and Plugins": [
      "portfolio/sela",
      "mateship-stream-sip-2",
    ],

    // PSBA-Manila
    "Philippine School of Business Administration, Manila": ["portfolio/psba"],
    "PSBA Manila - Disaster Risk Management Unit": ["portfolio/psba-drm"],
    "PSBA Manila - Online Public Access Catalog": ["portfolio/psba-opac"],
    "PSBA Manila - E-learning System": ["portfolio/psba-elearning"],
    "Imperial Dunes": ["portfolio/imperial-dunes"],

    // Hampton Peak
    "inHomePortal.com Sales Website": ["portfolio/inhomeportal-sales"],
    "inHomePortal.com": [
      "portfolio/inhomeportal-signaturepark",
      "portfolio/inhomeportal-signaturepark-2",
      "portfolio/inhomeportal-thomsonthree",
      "portfolio/inhomeportal-thomsonthree-2",
      "portfolio/inhomeportal-flamingovalley",
      "portfolio/inhomeportal-tembusu",
      "portfolio/inhomeportal-siena",
    ],

    // Sytian IT Solutions
    "Sytian Store": [
      "portfolio/sytian-store-harlan-holden",
      "portfolio/sytian-store-soak-swimwear",
    ],
    "Sytian Productions": ["portfolio/sytian-productions"],
    "WordPress Websites": [
      "portfolio/sytian-wp-dermstrata",
      "portfolio/sytian-wp-celticforest",
      "portfolio/sytian-wp-jakinspections",
      "portfolio/sytian-wp-tampopo",
      "portfolio/sytian-wp-cog",
    ],
    "Customizable Websites": [
      "portfolio/sytian-customizable-lotus-garden",
      "portfolio/sytian-customizable-northstar",
      "portfolio/sytian-customizable-techdive",
      "portfolio/sytian-customizable-veritas",
      "portfolio/depedbataan",
    ],

    // Personal Works
    LottoPh: ["portfolio/personal-lottoph"],
    "Inggo Noms...": ["portfolio/personal-noms"],
    Ordertaker: [
      "portfolio/personal-ordertaker",
      "portfolio/personal-ordertaker-mobile",
      "portfolio/personal-ordertaker-messenger",
    ],
  },

  // ─── Left face ─────────────────────────────────────────────────────────────
  work: {
    // 'Company / Organization name': ['public-id'],
  },

  // ─── Top face ──────────────────────────────────────────────────────────────
  education: {
    // 'Institution name': ['public-id'],
  },

  // ─── Bottom face ───────────────────────────────────────────────────────────
  skills: {
    // 'Category name': ['public-id'],
  },
};
