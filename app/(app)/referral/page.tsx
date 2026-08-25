"use client";

import React from "react";
import {
  Gift,
  Copy,
  Share2,
  MessageCircle,
  MessageSquare,
  Link2,
  Users,
  Hourglass,
  Wallet,
  UserPlus,
  ArrowLeftRight,
  Trophy,
  Info,
} from "lucide-react";
import { Card, Avatar, SectionTitle, StatsCard } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/lib/i18n";
import { formatGnf, formatNumber, classNames } from "@/lib/format";

const REFERRAL_CODE = "NIMBA-MD24";
const REFERRAL_LINK = `https://nimba-money.vercel.app/?ref=${REFERRAL_CODE}`;

interface Invitee {
  name: string;
  initials: string;
  hue: number;
  phone: string;
  date: string; // fr, en
  dateEn: string;
  status: "rewarded" | "pending";
}

const invitees: Invitee[] = [
  { name: "Alpha Oumar Barry", initials: "AB", hue: 150, phone: "+224 62• •• ••34", date: "12 août 2026", dateEn: "Aug 12, 2026", status: "rewarded" },
  { name: "Kadiatou Sylla", initials: "KS", hue: 200, phone: "+224 66• •• ••81", date: "9 août 2026", dateEn: "Aug 9, 2026", status: "rewarded" },
  { name: "Sékou Condé", initials: "SC", hue: 30, phone: "+224 61• •• ••07", date: "2 août 2026", dateEn: "Aug 2, 2026", status: "rewarded" },
  { name: "Mariama Diallo", initials: "MD", hue: 280, phone: "+224 62• •• ••59", date: "28 juil. 2026", dateEn: "Jul 28, 2026", status: "rewarded" },
  { name: "Ousmane Touré", initials: "OT", hue: 90, phone: "+224 65• •• ••22", date: "21 juil. 2026", dateEn: "Jul 21, 2026", status: "rewarded" },
  { name: "Fatoumata Camara", initials: "FC", hue: 330, phone: "+224 66• •• ••48", date: "18 août 2026", dateEn: "Aug 18, 2026", status: "pending" },
  { name: "Ibrahima Bah", initials: "IB", hue: 250, phone: "+224 61• •• ••93", date: "23 août 2026", dateEn: "Aug 23, 2026", status: "pending" },
];

interface LeaderRow {
  rank: number;
  name: string;
  initials: string;
  hue: number;
  invites: number;
  gainsGnf: number;
  you?: boolean;
}

const leaderboard: LeaderRow[] = [
  { rank: 1, name: "Mamadou B.", initials: "MB", hue: 20, invites: 18, gainsGnf: 360_000 },
  { rank: 2, name: "Aïssatou C.", initials: "AC", hue: 300, invites: 12, gainsGnf: 240_000 },
  { rank: 3, name: "Mohamed D.", initials: "MD", hue: 150, invites: 7, gainsGnf: 140_000, you: true },
  { rank: 4, name: "Ibrahima S.", initials: "IS", hue: 220, invites: 6, gainsGnf: 120_000 },
  { rank: 5, name: "Fanta K.", initials: "FK", hue: 45, invites: 5, gainsGnf: 100_000 },
];

export default function ReferralPage() {
  const { lang, t } = useI18n();
  const { toast } = useToast();

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_CODE);
    } catch {
      // demo — clipboard may be unavailable
    }
    toast(t("Code copié", "Code copied"));
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_LINK);
    } catch {
      // demo — clipboard may be unavailable
    }
    toast(t("Lien copié", "Link copied"));
  };

  const shareWhatsApp = () => {
    const msg = t(
      `Rejoins-moi sur Nimba Money ! Utilise mon code ${REFERRAL_CODE} et on gagne chacun 20 000 GNF après ton premier échange. ${REFERRAL_LINK}`,
      `Join me on Nimba Money! Use my code ${REFERRAL_CODE} and we each earn 20,000 GNF after your first trade. ${REFERRAL_LINK}`
    );
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const steps = [
    {
      Icon: Share2,
      title: t("Partagez votre code", "Share your code"),
      text: t(
        "Envoyez votre code ou votre lien de parrainage à vos amis par WhatsApp, SMS ou en direct.",
        "Send your referral code or link to friends via WhatsApp, SMS or in person."
      ),
    },
    {
      Icon: UserPlus,
      title: t("Votre ami s'inscrit et trade", "Your friend signs up and trades"),
      text: t(
        "Il crée son compte avec votre code, passe la vérification KYC et complète son premier ordre.",
        "They create an account with your code, pass KYC verification and complete their first order."
      ),
    },
    {
      Icon: Wallet,
      title: t("Vous recevez chacun 20 000 GNF", "You each receive 20,000 GNF"),
      text: t(
        "La récompense est partagée 50/50 : 20 000 GNF pour vous, 20 000 GNF pour votre ami.",
        "The reward is split 50/50: 20,000 GNF for you, 20,000 GNF for your friend."
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* hero */}
      <Card className="overflow-hidden !border-brand-800 bg-gradient-to-br from-brand-900 to-brand-950 text-white">
        <div className="card-pad">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Gift className="h-6 w-6 text-brand-200" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-extrabold">
                {t("Invitez, gagnez ensemble", "Invite, earn together")}
              </h1>
              <p className="mt-1 text-sm leading-relaxed text-brand-100/90">
                {t(
                  "Vous et votre invité recevez chacun 20 000 GNF après son premier échange complété. Partage 50/50, automatique.",
                  "You and your invitee each receive 20,000 GNF after their first completed trade. 50/50 split, automatic."
                )}
              </p>
            </div>
          </div>

          {/* code block */}
          <div className="mt-5 rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-4">
            <p className="text-2xs font-semibold uppercase tracking-wide text-brand-200">
              {t("Votre code de parrainage", "Your referral code")}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-2xl font-extrabold tracking-widest">
                {REFERRAL_CODE}
              </p>
              <Button variant="secondary" size="sm" onClick={copyCode}>
                <Copy className="h-3.5 w-3.5" aria-hidden />
                {t("Copier", "Copy")}
              </Button>
            </div>
          </div>

          {/* share row */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={shareWhatsApp}>
              <MessageCircle className="h-3.5 w-3.5" aria-hidden />
              WhatsApp
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast(t("SMS de parrainage envoyé (démo)", "Referral SMS sent (demo)"), "info")}
            >
              <MessageSquare className="h-3.5 w-3.5" aria-hidden />
              SMS
            </Button>
            <Button variant="secondary" size="sm" onClick={copyLink}>
              <Link2 className="h-3.5 w-3.5" aria-hidden />
              {t("Copier le lien", "Copy link")}
            </Button>
          </div>
        </div>
      </Card>

      {/* stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <StatsCard
          label={t("Invités", "Invited")}
          value={formatNumber(7)}
          icon={<Users className="h-4 w-4" aria-hidden />}
        />
        <StatsCard
          label={t("En attente de 1er trade", "Awaiting 1st trade")}
          value={formatNumber(2)}
          icon={<Hourglass className="h-4 w-4" aria-hidden />}
        />
        <StatsCard
          label={t("Gains totaux", "Total earnings")}
          value={formatGnf(140_000)}
          icon={<Wallet className="h-4 w-4" aria-hidden />}
        />
      </div>

      {/* how it works */}
      <section>
        <SectionTitle title={t("Comment ça marche", "How it works")} />
        <div className="grid gap-3 md:grid-cols-3">
          {steps.map(({ Icon, title, text }, i) => (
            <Card key={title} className="card-pad">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-extrabold text-white">
                  {i + 1}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/60 dark:text-brand-300">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
              </div>
              <p className="mt-2.5 text-[13px] font-bold">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted dark:text-[#8FA79C]">
                {text}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* invited list */}
      <section>
        <SectionTitle
          title={t("Vos invités", "Your invitees")}
          subtitle={t(
            "5 récompensés · 2 en attente de leur premier trade",
            "5 rewarded · 2 awaiting their first trade"
          )}
        />
        <Card>
          <ul className="divide-y divide-line dark:divide-night-line">
            {invitees.map((inv) => (
              <li
                key={inv.phone}
                className="flex flex-wrap items-center gap-3 px-4 py-3"
              >
                <Avatar initials={inv.initials} hue={inv.hue} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{inv.name}</p>
                  <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                    {inv.phone} · {t(`Invité le ${inv.date}`, `Invited ${inv.dateEn}`)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {inv.status === "rewarded" ? (
                    <>
                      <span className="text-xs font-bold tabular-nums text-brand-600 dark:text-brand-300">
                        +{formatGnf(20_000)}
                      </span>
                      <Pill tone="green">{t("Récompensé", "Rewarded")}</Pill>
                    </>
                  ) : (
                    <Pill tone="amber">{t("En attente", "Pending")}</Pill>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* leaderboard */}
      <section>
        <SectionTitle
          title={t("Top parrains du mois", "Top referrers this month")}
          subtitle={t("Classement démo — août 2026", "Demo leaderboard — August 2026")}
        />
        <Card>
          <ul className="divide-y divide-line dark:divide-night-line">
            {leaderboard.map((row) => (
              <li
                key={row.rank}
                className={classNames(
                  "flex items-center gap-3 px-4 py-3",
                  row.you &&
                    "bg-brand-50/60 ring-1 ring-inset ring-brand-300 dark:bg-brand-900/30 dark:ring-brand-700"
                )}
              >
                <span
                  className={classNames(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold",
                    row.rank === 1
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                      : row.rank === 2
                        ? "bg-gray-100 text-gray-600 dark:bg-night-raised dark:text-[#B7C9C0]"
                        : row.rank === 3
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300"
                          : "bg-surface-sunken text-ink-muted dark:bg-night-raised dark:text-[#8FA79C]"
                  )}
                >
                  {row.rank === 1 ? <Trophy className="h-3.5 w-3.5" aria-hidden /> : row.rank}
                </span>
                <Avatar initials={row.initials} hue={row.hue} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">
                    {row.name}
                    {row.you && (
                      <span className="ml-1.5 text-xs font-semibold text-brand-600 dark:text-brand-300">
                        ({t("Vous", "You")})
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted dark:text-[#8FA79C]">
                    {formatNumber(row.invites)}{" "}
                    {t(
                      row.invites > 1 ? "invités" : "invité",
                      row.invites > 1 ? "invites" : "invite"
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold tabular-nums">
                  <ArrowLeftRight
                    className="h-3.5 w-3.5 text-brand-500"
                    aria-hidden
                  />
                  {formatGnf(row.gainsGnf)}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* terms footnote */}
      <p className="flex items-start gap-1.5 text-2xs leading-relaxed text-ink-muted dark:text-[#8FA79C]">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>
          {lang === "fr"
            ? "Conditions (démo) : la récompense de 20 000 GNF est versée à chacun après le premier ordre complété d'un montant ≥ 100 000 GNF par l'invité. Anti-abus : 1 compte par identité KYC ; les comptes en double ne sont pas récompensés. Programme fictif à des fins de démonstration."
            : "Terms (demo): the 20,000 GNF reward is paid to each party after the invitee's first completed order of ≥ 100,000 GNF. Anti-abuse: 1 account per KYC identity; duplicate accounts are not rewarded. Fictional program for demonstration purposes."}
        </span>
      </p>
    </div>
  );
}
