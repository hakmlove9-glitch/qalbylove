import {
  createClient as createSupabaseJsClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

function requirePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "إعدادات Supabase العامة غير مكتملة. تأكد من NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return { url, anonKey };
}

function requireAdminEnv() {
  const { url } = requirePublicEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "مفتاح SUPABASE_SERVICE_ROLE_KEY غير موجود في بيئة الخادم.",
    );
  }

  return { url, serviceRoleKey };
}

/*
 * لا نربط browserClient بـ ReturnType<typeof createSupabaseJsClient>.
 * في إصدارات Supabase الحديثة، overloads/generics الخاصة بـ createClient
 * قد تجعل ReturnType يُستنتج على schema = never عند التخزين في متغير عام.
 * SupabaseClient<any> هو النوع الصحيح هنا لأن المشروع لا يولّد Database types بعد.
 */
let browserClient: SupabaseClient<any> | null = null;

export function createClient(): SupabaseClient<any> {
  const { url, anonKey } = requirePublicEnv();

  return createSupabaseJsClient<any>(url, anonKey, {
    auth: {
      persistSession: typeof window !== "undefined",
      autoRefreshToken: typeof window !== "undefined",
      detectSessionInUrl: typeof window !== "undefined",
    },
  });
}

export function getBrowserSupabaseClient(): SupabaseClient<any> {
  if (!browserClient) {
    browserClient = createClient();
  }

  return browserClient;
}

/**
 * عميل عام متوافق مع الملفات القديمة.
 * Proxy يمنع إنشاء Supabase Client أثناء import وقت الـbuild.
 */
export const supabase = new Proxy({} as SupabaseClient<any>, {
  get(_target, property) {
    const client = getBrowserSupabaseClient() as any;
    const value = client[property];

    return typeof value === "function" ? value.bind(client) : value;
  },
});

export function createSupabaseClient(): SupabaseClient<any> {
  const { url, anonKey } = requirePublicEnv();

  return createSupabaseJsClient<any>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export function createSupabaseAdminClient(): SupabaseClient<any> {
  if (typeof window !== "undefined") {
    throw new Error("عميل الإدارة لا يجوز إنشاؤه داخل المتصفح.");
  }

  const { url, serviceRoleKey } = requireAdminEnv();

  return createSupabaseJsClient<any>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
