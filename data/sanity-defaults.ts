import { EDEN_ORIGIN } from "@eden-ecommerce/lib/eden/build-urls";
import { publicAssetPath } from "@/lib/config";

export type SanityNavItem = {
  text: string;
  link: string;
  textColour: string | null;
};

export type SanityHeaderInfo = {
  heading: string;
  subheading: string;
};

export type SanityFooterLink = {
  text: string;
  url: string;
  seoRel: string;
  newTab: boolean;
};

export type SanityFooterInfo = {
  heading?: string;
  subheading?: string;
  imageAlt?: string;
  imageUrl?: string;
};

export const SANITY_CDN_PROJECT_ID = "bct7esy7";
export const SANITY_CDN_DATASET = "eden";

/** Set true when CMS mega-nav panels are ready to ship. */
export const HEADER_MEGA_NAV_ENABLED = false;

export const SANITY_ASSETS = {
  free: publicAssetPath("/assets/sanity/Free.svg"),
  uk: publicAssetPath("/assets/sanity/UK.svg"),
  church: publicAssetPath("/assets/sanity/Church.svg"),
  trustpilotStar: publicAssetPath("/assets/sanity/TrustpilotStar.svg"),
  trustpilotSmallStar: publicAssetPath("/assets/sanity/TrustpilotSmallStar.svg"),
  trustpilotMobile: publicAssetPath("/assets/sanity/TrustpilotMobile.svg"),
  socialProofBackground: publicAssetPath("/assets/sanity/SocialProofBackground.svg"),
  socialProofBackgroundShallow: publicAssetPath("/assets/sanity/SocialProofBackgroundShallow.svg"),
  logoSummer: publicAssetPath("/assets/sanity/EdenLogoSummer.svg"),
  logoStandard: publicAssetPath("/StandardLogo.svg"),
  facebook: publicAssetPath("/assets/sanity/Facebook.svg"),
  twitter: publicAssetPath("/assets/sanity/Twitter.svg"),
} as const;

export const SANITY_LINKS = {
  headerHelp: "https://helpdesk.eden.co.uk/support/home",
  accountLogin:
    "https://www.eden.co.uk/secure/myeden/login.php?delayBasketMerge=false&redirect=https%3A%2F%2Fwww.eden.co.uk%2Fo%2Forganisations",
  basket: "https://www.eden.co.uk/shop/basket.php",
  home: `${EDEN_ORIGIN}/`,
} as const;

export const SANITY_HEADER_DEFAULTS = {
  logoVariant: "standard" as const,
  phoneNumber: "0345 222 3336",
  openHour: "Weekdays 8.30 - 17.30",
  socialProofRating: 4.8,
  socialProofMaxRating: 5,
  headerInfo: [
    {
      heading: "Life giving resources. Faithfully delivered.",
      subheading: "FREE delivery on orders over £10",
    },
    {
      heading: "Serving over 2 million Christians in the UK",
      subheading: "with Bibles, Books and Church Supplies",
    },
    {
      heading: "Our Buy-Now-Pay-Later accounts used",
      subheading: "by over 4,000 UK Churches & Schools",
    },
  ] satisfies SanityHeaderInfo[],
  navigationBar: [
    { text: "Christian Books", link: "https://www.eden.co.uk/christian-books/", textColour: null },
    { text: "Bibles", link: "https://www.eden.co.uk/bibles/", textColour: null },
    { text: "Children & Youth", link: "https://www.eden.co.uk/childrens/", textColour: null },
    { text: "Church Supplies", link: "https://www.eden.co.uk/church-supplies/", textColour: null },
    { text: "Home & Living", link: "https://www.eden.co.uk/home-and-living/", textColour: null },
    { text: "Christian Gifts", link: "https://www.eden.co.uk/christian-gifts/", textColour: null },
    { text: "Cards", link: "https://www.eden.co.uk/christian-greeting-cards/", textColour: null },
    { text: "Top 50", link: "https://www.eden.co.uk/top-50-all/", textColour: null },
    { text: "Christian Jobs", link: "https://www.eden.co.uk/christian-jobs", textColour: null },
    { text: "Christian Events", link: "https://www.eden.co.uk/events", textColour: null },
    { text: "Christian Charities", link: "https://www.eden.co.uk/o/organisations", textColour: null },
  ] satisfies SanityNavItem[],
};

export const SANITY_FOOTER_DEFAULTS = {
  socialProofHeading: "Excellent 4.8 out of 5",
  socialProofSubheading: "Based on 50,000+ reviews on Trustpilot",
  footerInfo: [
    {
      imageAlt: "Living Wage Banner",
      imageUrl: `https://cdn.sanity.io/images/${SANITY_CDN_PROJECT_ID}/${SANITY_CDN_DATASET}/e9ab2ede08dbe4647bc2edc65de35009ba86fb21-220x70.png`,
    },
    { heading: "20 years", subheading: "Serving UK Church" },
    { heading: "175,000", subheading: "Christian Products Available" },
    { heading: "3,500,000 +", subheading: "Visitors / year" },
    { heading: "215,000 +", subheading: "Bibles supplied / year" },
    { heading: "3,000,000+", subheading: "Orders fulfilled" },
  ] satisfies SanityFooterInfo[],
  footerLinks: [
    {
      text: "About Us",
      seoRel: "nofollow,noindex",
      newTab: false,
      url: "https://helpdesk.eden.co.uk/support/home",
    },
    {
      text: "Privacy Policy",
      seoRel: "nofollow,noindex",
      newTab: false,
      url: "https://helpdesk.eden.co.uk/support/solutions/articles/101000408925-privacy-policy",
    },
    {
      text: "Payment Methods",
      seoRel: "nofollow,noindex",
      newTab: false,
      url: "https://helpdesk.eden.co.uk/support/solutions/folders/101000306544",
    },
    {
      text: "Eden Blog",
      seoRel: "follow,index",
      newTab: false,
      url: "https://www.eden.co.uk/blog",
    },
    {
      text: "Delivery Info",
      seoRel: "nofollow,noindex",
      newTab: false,
      url: "https://helpdesk.eden.co.uk/support/solutions/folders/101000307699",
    },
    {
      text: "Return Info",
      seoRel: "nofollow,noindex",
      newTab: false,
      url: "https://helpdesk.eden.co.uk/support/solutions/folders/101000304359",
    },
    {
      text: "Help & Support",
      seoRel: "nofollow,noindex",
      newTab: false,
      url: "https://helpdesk.eden.co.uk/support/home",
    },
    {
      text: "Contact Us",
      seoRel: "nofollow,noindex",
      newTab: false,
      url: "https://helpdesk.eden.co.uk/support/solutions/articles/101000238084-contact-us",
    },
  ] satisfies SanityFooterLink[],
};

export const SANITY_SOCIAL_LINKS = [
  { type: "facebook" as const, url: "https://www.facebook.com/edencouk" },
  { type: "twitter" as const, url: "https://www.twitter.com/edencouk" },
];
