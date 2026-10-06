function hashKey(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pick(paths: string[], seed: string) {
  if (!paths.length) return "/images/site-v2/members/women-hijab/01.webp";
  return paths[hashKey(seed) % paths.length];
}

const femaleHijab = [
  "/images/site-v2/members/women-hijab/01.webp",
  "/images/site-v2/members/women-hijab/02.webp",
  "/images/site-v2/members/women-hijab/03.webp",
  "/images/site-v2/members/women-hijab/04.webp",
  "/images/site-v2/members/women-hijab/05.webp",
  "/images/site-v2/assistants/female/06.webp",
  "/images/site-v2/assistants/female/07.webp",
  "/images/site-v2/assistants/female/08.webp",
  "/images/site-v2/assistants/female/09.webp",
  "/images/site-v2/assistants/female/10.webp",
];

const femaleModest = [
  "/images/site-v2/members/women-no-hijab-modest/01.webp",
  "/images/site-v2/members/women-no-hijab-modest/02.webp",
  "/images/site-v2/members/women-no-hijab-modest/03.webp",
];

const maleModern = [
  "/images/site-v2/members/men-modern/01.webp",
  "/images/site-v2/members/men-modern/02.webp",
  "/images/site-v2/members/men-modern/03.webp",
  "/images/site-v2/members/men-modern/04.webp",
  "/images/site-v2/members/men-modern/05.webp",
  "/images/site-v2/assistants/male/06.webp",
  "/images/site-v2/assistants/male/07.webp",
  "/images/site-v2/assistants/male/08.webp",
  "/images/site-v2/assistants/male/09.webp",
  "/images/site-v2/assistants/male/10.webp",
];

const maleBearded = [
  "/images/site-v2/members/men-bearded/01.webp",
  "/images/site-v2/members/men-bearded/02.webp",
  "/images/site-v2/members/men-bearded/03.webp",
];

const maleClean = [
  "/images/site-v2/members/men-clean-shaven/01.webp",
  "/images/site-v2/members/men-clean-shaven/02.webp",
  "/images/site-v2/members/men-clean-shaven/03.webp",
];

export function fallbackAvatar(
  gender: unknown,
  age?: unknown,
  appearance?: { hijabStyle?: unknown; beardStyle?: unknown; seed?: unknown },
) {
  const normalizedGender = String(gender || "").trim().toLowerCase();
  const normalizedHijab = String(appearance?.hijabStyle || "").trim().toLowerCase();
  const normalizedBeard = String(appearance?.beardStyle || "").trim().toLowerCase();
  const seed = `${normalizedGender}|${String(age || "")}|${normalizedHijab}|${normalizedBeard}|${String(appearance?.seed || "")}`;

  if (normalizedGender === "female") {
    const usesHijab = !normalizedHijab || !["none", "no", "without", "لا", "بدون", "غير محجبة"].includes(normalizedHijab);
    return pick(usesHijab ? femaleHijab : femaleModest, seed || "female");
  }

  if (normalizedGender === "male") {
    const hasBeard = normalizedBeard && !["clean", "none", "no", "لا", "بدون", "حليق"].includes(normalizedBeard);
    const source = hasBeard ? maleBearded : (Number(age || 0) % 2 === 0 ? maleModern : maleClean);
    return pick(source, seed || "male");
  }

  return pick([...femaleHijab, ...maleModern], seed || "member");
}
