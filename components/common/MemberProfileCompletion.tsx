"use client";

type Props = {
  username?: string;
  city?: string;
  age?: number;
  maritalStatus?: string;
  bio?: string;
};

export default function MemberProfileCompletion({
  username,
  city,
  age,
  maritalStatus,
  bio,
}: Props) {
  const fields = [
    Boolean(username?.trim()),
    Boolean(city?.trim()),
    Boolean(age && age >= 18),
    Boolean(
      maritalStatus?.trim()
    ),
    Boolean(bio?.trim()),
  ];

  const completed =
    fields.filter(Boolean)
      .length;

  const percentage =
    Math.round(
      (completed /
        fields.length) *
        100
    );

  return (
    <div
      dir="rtl"
      className="qalby-card p-5"
    >
      <div className="mb-3 flex items-center justify-between">

        <h2 className="font-bold text-rose-700">
          اكتمال ملفك الشخصي
        </h2>

        <strong className="text-rose-700">
          {percentage}%
        </strong>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-gray-100">

        <div
          className="h-full rounded-full bg-rose-600 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

      {percentage < 100 && (
        <p className="mt-3 text-sm text-gray-500">
          أكمل بياناتك الأساسية حتى
          يظهر ملفك بصورة أفضل للأعضاء.
        </p>
      )}

      {percentage === 100 && (
        <p className="mt-3 text-sm font-medium text-green-600">
          ملفك مكتمل ✅
        </p>
      )}
    </div>
  );
}