export type ProfileCompletion = {
  percentage: number;
  completed: string[];
  missing: string[];
  ready: boolean;
};

export async function getMyProfile() {
  try {
    const response = await fetch("/api/profile", {
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.profile || null;
  } catch {
    return null;
  }
}

export async function getMyProfileCompletion(): Promise<ProfileCompletion> {
  try {
    const response = await fetch("/api/profile/completion", {
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return { percentage: 0, completed: [], missing: [], ready: false };
    }

    const data = await response.json();
    return {
      percentage: Number(data.percentage || 0),
      completed: Array.isArray(data.completed) ? data.completed : [],
      missing: Array.isArray(data.missing) ? data.missing : [],
      ready: data.ready === true,
    };
  } catch {
    return { percentage: 0, completed: [], missing: [], ready: false };
  }
}

export async function updateMyProfile(payload: Record<string, unknown>) {
  try {
    const response = await fetch("/api/profile", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      profile: data.profile || null,
      error: response.ok ? "" : String(data.error || "تعذر حفظ الملف"),
    };
  } catch {
    return {
      ok: false,
      profile: null,
      error: "تعذر الاتصال أثناء حفظ الملف",
    };
  }
}

export async function uploadProfilePhoto(file: File) {
  const form = new FormData();
  form.append("image", file);

  try {
    const response = await fetch("/api/photos", {
      method: "POST",
      credentials: "include",
      body: form,
    });

    const data = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      data,
      error: response.ok ? "" : String(data.error || "تعذر رفع الصورة"),
    };
  } catch {
    return {
      ok: false,
      data: null,
      error: "تعذر الاتصال أثناء رفع الصورة",
    };
  }
}
