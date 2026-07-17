// Site content extracted from the original 1031referral.com WordPress/Elementor site.
// Single source of truth for all page copy so components stay presentational.

export const site = {
  name: "1031 Referral",
  domain: "1031referral.com",
  phones: [
    { label: "Local", number: "(415) 936-1030", href: "tel:+14159361030" },
    { label: "Toll-free", number: "(866) 261-0104", href: "tel:+18662610104" },
  ],
  email: "info@1031referral.com",

  nav: {
    cta: { label: "FIND AN ACCOMMODATOR", href: "#find-accommodator" },
    links: [
      { label: "Qualified Intermediary", href: "#qualified-intermediary" },
      { label: "1031 Exchange", href: "#what-is-1031" },
      { label: "How It Works", href: "#steps" },
      { label: "Get Started", href: "#find-accommodator" },
    ],
  },

  hero: {
    eyebrow: "WELCOME! WE'RE GLAD YOU'RE HERE!",
    heading:
      "It looks like you're either participating in a 1031 exchange or thinking about it.",
    primaryCta: { label: "SELECT AN ACCOMMODATOR", href: "#find-accommodator" },
    secondaryCta: { label: "I have 1031 Exchange Questions", href: "#what-is-1031" },
  },

  qi: {
    id: "qualified-intermediary",
    title: "The role of a QI is critical to 1031 Exchanges",
    body:
      "One of the most important steps for you as you navigate this process will be to find an accommodator…also known as a qualified intermediary (QI). The role of a QI is critical to a 1031 exchange. So critical – you can't complete the 1031 exchange without one! Since this role is so important, there are a variety of traits you should insist upon in a qualified intermediary. In fact, this is the criteria we use when vetting accommodators for our proprietary referral database.",
    traits: [
      "A member of the Federation of Exchange Accommodators (FEA) and a Certified Exchange Specialist (CES)",
      "Access to qualified accounts (segregated qualified trust accounts or segregated qualified escrow accounts) to hold the exchange funds",
      "Ability to open separate FDIC-insured accounts for each client",
      "Fidelity bonded and insured to provide security of funds",
      "Affiliated with a large, nationally recognized company",
      "Protected with E&O insurance",
      "Proven history of being responsive, fast, reliable, transparent and secure",
      "Experienced in both traditional, reverse and improvement 1031 exchanges",
    ],
    functionsTitle: "What functions does a qualified intermediary perform?",
    functionsBody:
      "Qualified intermediaries perform a variety of duties. Since an exchangor (that's you!) is not allowed to take possession of the equity of the sale involved in the exchange, a QI must be employed to take on the responsibility of managing the sale proceeds. Additionally, your QI will prepare all the documentation needed to satisfy exchange requirements. These experienced professionals are well-versed in the exchange process and will keep you ahead of critical deadlines like the all-important 45-day identification and 180-day closing periods.",
    cta: { label: "LEARN MORE", href: "#what-is-1031" },
  },

  what1031: {
    id: "what-is-1031",
    eyebrow: "THE BASICS",
    title: "What is a 1031 Exchange?",
    body:
      "If you own an investment property and are selling it, you should know about a 1031 tax-deferred exchange and understand your options. Administered correctly and successfully, a 1031 tax-deferred exchange can be a powerful tool allowing you, the investor, to sell and buy like-kind property to defer capital gains tax while preserving the value of your property and hard-earned equity. A tax-deferred exchange under Section 1031 of the Internal Revenue Code allows you to sell your investment property and acquire another like-kind property while deferring state and federal capital gains taxes. You can then reinvest your sale proceeds that would otherwise be paid to the government as capital gains taxes.",
    cta: { label: "START YOUR EXCHANGE PROCESS", href: "#find-accommodator" },
  },

  steps: {
    id: "steps",
    eyebrow: "HOW DOES IT WORK",
    title: "1031 Exchange Steps",
    items: [
      {
        src: "/assets/step-1.svg",
        alt: "1031 Exchange Step 1",
        title: "Sell Your Property",
        body:
          "You sell an investment property and enter into a purchase contract that obligates the buyer at no cost to cooperate in closing the transaction as a 1031 exchange with the help of a qualified intermediary (QI). Your relinquished property purchase contract should contain a cooperation clause, which obligates the buyer to cooperate with you in structuring the transaction as a 1031 exchange.",
      },
      {
        src: "/assets/step-2.svg",
        alt: "1031 Exchange Step 2",
        title: "Appoint a Qualified Intermediary / Accommodator",
        body:
          "1031referral.com will assist you in finding a qualified intermediary with whom you'll open an exchange account to transfer the proceeds from the sale. An accommodator will review the purchase agreement, title report and draft exchange documents to be executed by the exchanger. The exchanger must not take possession of the funds, or the exchange will be disqualified.",
      },
      {
        src: "/assets/step-3.svg",
        alt: "1031 Exchange Step 3",
        title: "Identify a Like-Kind Property",
        body:
          "The exchangor of the property identifies replacement properties within 45 days of the close of sale and notifies the qualified intermediary by midnight of the 45th day. The escrow agent will advise the qualified intermediary of the specific replacement property on your identification list you will be acquiring and who will be handling the closing.",
      },
      {
        src: "/assets/step-4.svg",
        alt: "1031 Exchange Step 4",
        title: "Close Escrow Within 180 Days",
        body:
          "For escrow to close the closing date must occur within 180 days of the closing on the relinquished property (or by your tax return due date - whichever comes sooner), or the exchange won't qualify for Section 1031 tax-deferred treatment.",
      },
    ],
    cta: { label: "START YOUR EXCHANGE PROCESS", href: "#find-accommodator" },
  },

  findAccommodator: {
    id: "find-accommodator",
    eyebrow: "GET STARTED",
    title: "Find An Accommodator (QI)",
    body:
      "Please review and update any information as needed. Please click submit and an accommodator (QI) will be immediately assigned to you.",
  },

  footer: {
    aboutTitle: "About Us",
    aboutBody:
      "1031referral.com is an independent third-party service that qualifies and vets QIs and their credentials to refer them as trusted specialists. We do not charge a fee nor do we receive compensation for referrals to any party…we just hope to empower 1031 investors with the right information, tools and resources and provide a valuable place for answers to common and not-so-common exchange questions.",
    contactTitle: "Contact Us",
  },
} as const;

export type Site = typeof site;
