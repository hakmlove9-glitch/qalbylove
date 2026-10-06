import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { MEMBERSHIP_PLANS, type MembershipTierId } from "@/lib/constants";

export const PLAN_FEATURES = {
  message_privacy: "خيارات أوسع لإدارة الرسائل بعد الاهتمام المتبادل",
  hide_ads: "تصفح بدون إعلانات",
  featured_profile: "إبراز الملف بين الأعضاء",
  change_username: "تعديل الاسم الظاهر",
  hidden_login: "دخول متخفي",
  priority_support: "أولوية الدعم والمراجعة",
  profile_badge: "وسام عضوية مرئي",
  profile_frame: "إطار مميز للصورة والملف",
  extended_visitors: "متابعة أوسع لزوار الملف",
} as const;

export type PremiumFeature = keyof typeof PLAN_FEATURES;
export type PlanFeatures = Partial<Record<PremiumFeature, boolean>>;

export const DEFAULT_PLANS = MEMBERSHIP_PLANS.map((plan, index) => ({
  tier_id: plan.id,
  name: plan.planName,
  display_name: plan.title,
  badge: plan.badge,
  price: plan.price,
  duration_months: plan.durationMonths,
  sort_order: index + 1,
  popular: plan.featured,
}));

const FEATURE_MATRIX: Record<MembershipTierId, PlanFeatures> = {
  silver: {
    hide_ads: true,
    priority_support: true,
    profile_badge: true,
    message_privacy: true,
  },
  gold: {
    message_privacy: true,
    hide_ads: true,
    featured_profile: true,
    change_username: true,
    hidden_login: true,
    priority_support: true,
    profile_badge: true,
  },
  diamond: {
    message_privacy: true,
    hide_ads: true,
    featured_profile: true,
    change_username: true,
    hidden_login: true,
    priority_support: true,
    profile_badge: true,
    profile_frame: true,
    extended_visitors: true,
  },
  royal: {
    message_privacy: true,
    hide_ads: true,
    featured_profile: true,
    change_username: true,
    hidden_login: true,
    priority_support: true,
    profile_badge: true,
    profile_frame: true,
    extended_visitors: true,
  },
};

export const PREMIUM_FEATURES: PlanFeatures = FEATURE_MATRIX.royal;

export function membershipTierFromDuration(months: number): MembershipTierId {
  if (months >= 12) return "royal";
  if (months >= 6) return "diamond";
  if (months >= 3) return "gold";
  return "silver";
}

export function membershipPlanByTier(tier: MembershipTierId) {
  return MEMBERSHIP_PLANS.find((plan) => plan.id === tier) || MEMBERSHIP_PLANS[0];
}

export function membershipPlanByDuration(months: number) {
  return membershipPlanByTier(membershipTierFromDuration(months));
}

export function membershipBadgeFromDuration(months: number) {
  const plan = membershipPlanByDuration(months);
  return {
    tier: plan.id,
    title: plan.title,
    badge: plan.badge,
  };
}

export async function getActiveSubscription(memberId: string) {
  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("id,user_id,plan_id,plan_name,price,duration_months,status,starts_at,ends_at,created_at")
    .eq("user_id", memberId)
    .eq("status", "active")
    .gte("ends_at", now)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getActiveSubscription:", error.message);
    return null;
  }

  return data ?? null;
}

export async function getMembershipPresentation(memberId: string) {
  const supabase = createSupabaseAdminClient();

  const [{ data: member }, subscription] = await Promise.all([
    supabase.from("members").select("is_founder").eq("id", memberId).maybeSingle(),
    getActiveSubscription(memberId),
  ]);

  if (member?.is_founder) {
    return {
      active: true,
      founder: true,
      tier: "founder" as const,
      title: "عضو مؤسس",
      badge: "وسام المؤسسين",
      durationMonths: 0,
    };
  }

  if (!subscription) {
    return {
      active: false,
      founder: false,
      tier: "basic" as const,
      title: "عضو أساسي",
      badge: "",
      durationMonths: 0,
    };
  }

  const plan = membershipPlanByDuration(Number(subscription.duration_months || 1));

  return {
    active: true,
    founder: false,
    tier: plan.id,
    title: plan.title,
    badge: plan.badge,
    durationMonths: plan.durationMonths,
    endsAt: subscription.ends_at,
  };
}

export async function hasPremiumFeature(memberId: string, feature: PremiumFeature) {
  const supabase = createSupabaseAdminClient();

  const { data: member } = await supabase
    .from("members")
    .select("is_founder")
    .eq("id", memberId)
    .maybeSingle();

  if (member?.is_founder === true) return true;

  const subscription = await getActiveSubscription(memberId);
  if (!subscription) return false;

  const duration = Number(subscription.duration_months || 1);
  const tier = membershipTierFromDuration(duration);

  const { data: plan } = await supabase
    .from("subscription_plans")
    .select("features")
    .eq("id", subscription.plan_id)
    .maybeSingle();

  const databaseFeatures = (plan?.features || {}) as PlanFeatures;
  const tierFeatures = FEATURE_MATRIX[tier];

  return databaseFeatures[feature] === true || tierFeatures[feature] === true;
}
