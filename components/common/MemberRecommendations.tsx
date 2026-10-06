"use client";

import {
  useEffect,
  useState,
} from "react";

import ProfileCard from "@/components/common/ProfileCard";
import {
  createClient,
} from "@/lib/supabase/client";

interface MemberRecommendationsProps {
  memberId: string;
}

interface Member {
  id: string;
  name: string;
  age?: number;
  city?: string;
  image?: string;
  verified?: boolean;
  online?: boolean;
}

export default function MemberRecommendations({
  memberId,
}: MemberRecommendationsProps) {
  const supabase =
    createClient();

  const [
    members,
    setMembers,
  ] = useState<Member[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  async function loadRecommendations() {
    if (!memberId) {
      setMembers([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const {
        data: current,
        error: currentError,
      } = await supabase
        .from("members")
        .select(
          "city, gender"
        )
        .eq(
          "id",
          memberId
        )
        .single();

      if (
        currentError ||
        !current
      ) {
        setMembers([]);
        return;
      }

      let query = supabase
        .from("members")
        .select(`
          id,
          name,
          age,
          city,
          image,
          verified,
          online
        `)
        .neq(
          "id",
          memberId
        )
        .limit(8);

      if (current.city) {
        query = query.eq(
          "city",
          current.city
        );
      }

      const {
        data,
        error,
      } = await query;

      if (error) {
        console.error(error);
        setMembers([]);
        return;
      }

      setMembers(
        (data || []) as Member[]
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecommendations();

    const channel =
      supabase
        .channel(
          `recommendations-${memberId}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "members",
          },
          () => {
            loadRecommendations();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [memberId]);

  return (
    <section
      dir="rtl"
      className="mt-10"
    >
      <h2 className="mb-6 text-3xl font-bold text-rose-700">
        أشخاص قد يناسبونك 💕
      </h2>

      {loading && (
        <p className="mb-5 text-gray-400">
          جاري البحث عن اقتراحات...
        </p>
      )}

      {!loading &&
        members.length === 0 && (
          <div className="qalby-card p-6 text-center text-gray-500">
            لا توجد اقتراحات متاحة حاليًا.
          </div>
        )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map(
          (member) => (
            <ProfileCard
              key={member.id}
              id={member.id}
              name={member.name}
              age={member.age}
              city={member.city}
              image={member.image}
              verified={
                member.verified
              }
              online={
                member.online
              }
            />
          )
        )}
      </div>
    </section>
  );
}