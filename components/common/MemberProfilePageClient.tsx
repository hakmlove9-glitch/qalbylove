"use client"
type Props = { memberId: string; currentMemberId?: string }
export default function MemberProfilePageClient({ memberId, currentMemberId }: Props) {
  return <div data-member-id={memberId} data-current={currentMemberId} />
}
