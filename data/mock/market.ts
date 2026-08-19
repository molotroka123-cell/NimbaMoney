/**
 * MOCK DATA — development only. Marketplace overview metrics are
 * illustrative placeholders, clearly non-production.
 */

export const marketOverview = {
  requestsToday: 148,
  completedToday: 116,
  medianFillMinutes: 22,
  activeProviders: 19,
  availableLiquidityGnf: 2_900_000_000,
  repeatCustomerRate: 41,
  disputeRate: 1.2,
  /** 14-day matched-deals trend for the small activity line. */
  activityTrend: [62, 71, 68, 80, 84, 77, 90, 96, 88, 103, 99, 112, 108, 116],
};

export const announcements = [
  {
    id: "a1",
    fr: "Nouveaux partenaires vérifiés à Kaloum",
    en: "New verified providers in Kaloum",
    when: "il y a 2 jours",
    whenEn: "2 days ago",
  },
  {
    id: "a2",
    fr: "Matching Orange Money disponible",
    en: "Orange Money matching available",
    when: "il y a 3 jours",
    whenEn: "3 days ago",
  },
  {
    id: "a3",
    fr: "Nouveau quartier couvert : Matoto",
    en: "New district added: Matoto",
    when: "il y a 5 jours",
    whenEn: "5 days ago",
  },
  {
    id: "a4",
    fr: "Maintenance système terminée",
    en: "System maintenance complete",
    when: "il y a 6 jours",
    whenEn: "6 days ago",
  },
];

/** Partner dashboard metrics (illustrative). */
export const partnerOverview = {
  newRequestsToday: 9,
  matchedVolumeGnf: 87_500_000,
  leadConversion: 46,
  avgResponseMinutes: 8,
  completionRate: 98.9,
  estimatedFeesDueGnf: 1_750_000,
  leads30d: 47,
  profileViews30d: 1240,
  searchAppearances30d: 8630,
  acceptedLeads30d: 38,
  completedDeals30d: 31,
  avgLeadValueGnf: 6_400_000,
  weeklyRequests: [14, 18, 12, 22, 19, 26, 21],
  weeklyCompleted: [11, 15, 10, 19, 17, 24, 18],
  leadSources: [
    { labelFr: "Recherche", labelEn: "Search", pct: 52 },
    { labelFr: "Profil", labelEn: "Profile", pct: 27 },
    { labelFr: "Matching direct", labelEn: "Direct matching", pct: 16 },
    { labelFr: "Favoris", labelEn: "Saved", pct: 5 },
  ],
  districtDemand: [
    { district: "Kaloum", pct: 34 },
    { district: "Ratoma", pct: 26 },
    { district: "Matam", pct: 18 },
    { district: "Dixinn", pct: 13 },
    { district: "Matoto", pct: 9 },
  ],
};

/** Subscription plans — pricing is illustrative / configurable, not a commercial promise. */
export const plans = {
  free: {
    id: "free",
    nameFr: "Gratuit",
    nameEn: "Free",
    priceGnf: 0,
    featuresFr: [
      "Fiche publique vérifiée",
      "Réception de demandes",
      "Messagerie clients",
      "Statistiques de base",
    ],
    featuresEn: [
      "Public verified listing",
      "Receive requests",
      "Customer messaging",
      "Basic statistics",
    ],
  },
  pro: {
    id: "pro",
    nameFr: "Pro",
    nameEn: "Pro",
    priceGnf: 500_000, // illustrative / configurable
    featuresFr: [
      "Priorité dans le matching",
      "Badge Verified Pro",
      "Analytique des leads avancée",
      "Quartiers supplémentaires",
      "Profil enrichi",
      "Insights business",
    ],
    featuresEn: [
      "Priority in matching",
      "Verified Pro badge",
      "Advanced lead analytics",
      "Extra districts",
      "Enhanced profile",
      "Business insights",
    ],
  },
};
