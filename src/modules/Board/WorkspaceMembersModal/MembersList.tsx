import MemberRow, {
  MemberRowSkeleton,
  type WorkspaceMemberWithUser,
} from "./MemberRow";

export default function MembersList({
  members,
}: {
  members: WorkspaceMemberWithUser[] | undefined;
}) {
  return (
    <div>
      <p className="text-md my-4">{members?.length} Members</p>
      <div className="flex max-h-[30vh] flex-col gap-5 overflow-y-scroll">
        {members?.map((member) => {
          return <MemberRow key={member.id} member={member} />;
        })}
      </div>
    </div>
  );
}

export function MemberListSkeleton({
  numberOfMembers = 4,
}: {
  numberOfMembers?: number;
}) {
  const Rows = [];
  for (let i = 0; i < numberOfMembers; i++) {
    Rows.push(<MemberRowSkeleton key={i} />);
  }
  return (
    <div>
      <p className="text-md my-4">Members</p>
      <div className="flex max-h-[300px] flex-col gap-5 overflow-y-scroll">
        {Rows}
      </div>
    </div>
  );
}
