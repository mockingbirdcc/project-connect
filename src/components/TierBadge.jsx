import { TIERS } from "../data/seed";

export default function TierBadge({ tier }) {
  if (!tier || !TIERS[tier]) return null;
  return <span className={`tier-badge tier-${tier}`}>{TIERS[tier].short}</span>;
}
