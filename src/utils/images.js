import imageConfig from '../config/images.js';

export const CLOUDINARY_CLOUD = 'eatnyome';
export const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/`;

export function imageUrl(publicId) {
  return `${CLOUDINARY_BASE}${publicId}.avif`;
}

// Applies image config to the fetched data in-place, keyed by item/section name.
export function applyImageConfig(data) {
  const cfg = imageConfig;

  // Bio and Links share data.info but are separate faces
  if (data.info) {
    data.info.images      = cfg.bio   || [];
    data.info.linksImages = cfg.links || [];
  }

  // Portfolio: categories → items
  const portfolioCfg = cfg.portfolio || {};
  (data.portfolio || []).forEach((cat) =>
    cat.items.forEach((item) => {
      if (portfolioCfg[item.name]) item.images = portfolioCfg[item.name];
    })
  );

  // Work: companies (keyed by company or organization name)
  const workCfg = cfg.work || {};
  (data.work_experience || []).forEach((company) => {
    const key = company.company || company.organization;
    if (workCfg[key]) company.images = workCfg[key];
  });

  // Education: fields → institutes (keyed by institution name)
  const educCfg = cfg.education || {};
  Object.values(data.education || {}).forEach((list) =>
    (Array.isArray(list) ? list : []).forEach((item) => {
      if (educCfg[item.institution]) item.images = educCfg[item.institution];
    })
  );

  // Skills: categories (keyed by category name)
  const skillsCfg = cfg.skills || {};
  (data.skills || []).forEach((cat) => {
    if (skillsCfg[cat.category]) cat.images = skillsCfg[cat.category];
  });
}

// Collects all public IDs from the config for preloading.
export function collectAllImages() {
  const ids = [];
  const collect = (val) => {
    if (Array.isArray(val)) val.forEach((id) => ids.push(id));
    else if (val && typeof val === 'object') Object.values(val).forEach(collect);
  };
  collect(imageConfig);
  return ids;
}
