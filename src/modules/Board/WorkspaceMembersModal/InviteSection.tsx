import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/modules/ui/accordion";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/ui/select";
import { ALLOWED_ROLES_TO_INVITE } from "@/utils/AllowedRolesToInvite";
import { CreateWorkspaceInvitation } from "@/utils/ValidationSchema";
import { api } from "@/utils/api";
import { type WorkspaceMemberRoles } from "@prisma/client";
import { ErrorMessage, Field, Form, Formik, type FieldProps } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import PendingInviteRow, { PendingInviteRowSkeleton } from "./PendingInviteRow";
export default function InviteSection({
  CurrentUserRole,
  workspaceId,
}: {
  CurrentUserRole: WorkspaceMemberRoles | undefined;
  workspaceId: string;
}) {
  const { toast } = useToast();

  const utils = api.useContext();
  const mutation = api.workspace.inviteMember.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: async () => {
      await utils.workspace.getAllPendingInvitations
        .invalidate({ workspaceId })
        .catch((err) => console.log(err));
      toast({ title: "Succesfully sent invite" });
    },
  });

  return (
    <div>
      <p className="text-md my-4">Invite new member</p>
      <Formik
        initialValues={
          {
            email: "",
            role: "MEMBER",
            workspaceId,
          } as {
            email: string;
            role: "MEMBER" | "ADMIN";
            workspaceId: string;
          }
        }
        validationSchema={toFormikValidationSchema(CreateWorkspaceInvitation)}
        onSubmit={(values, { resetForm }) => {
          mutation.mutate(values);
          resetForm();
        }}
      >
        <Form>
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center ">
              <Field name="email">
                {({ field }: FieldProps) => (
                  <div className="w-full">
                    {/* <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your email
                    </label> */}
                    <Input
                      type="email"
                      id="email"
                      // className="block h-full w-full rounded-l-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-black focus:ring-black sm:text-sm"
                      placeholder="name@company.com"
                      required
                      {...field}
                    />
                  </div>
                )}
              </Field>
              <RoleSelector CurrentUserRole={CurrentUserRole} />
            </div>
            <Field name="submit">
              {({ form }: FieldProps) => (
                <Button
                  disabled={
                    mutation.isLoading ||
                    Object.keys(form.errors).length !== 0 ||
                    !form.dirty
                  }
                  type="submit"
                  isLoading={mutation.isLoading}
                  loadingText="Inviting"
                >
                  Invite
                </Button>
              )}
            </Field>
          </div>
          <div className="ml-2 mt-2 text-sm text-red-500">
            <ErrorMessage name="email" />
            <ErrorMessage name="role" />
          </div>
        </Form>
      </Formik>
      <PendingInvitationSection workspaceId={workspaceId} />
    </div>
  );
}

function PendingInvitationSection({
  workspaceId,
}: {
  workspaceId: string | undefined;
}) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="rounded-xl border-neutral-400 px-2 text-neutral-600">
          Pending Invitations
        </AccordionTrigger>
        <AccordionContent className="p-1">
          <PendingInvitationsList workspaceId={workspaceId} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
function PendingInvitationsList({
  workspaceId,
}: {
  workspaceId: string | undefined;
}) {
  const { data: pendingInvitations, isLoading } =
    api.workspace.getAllPendingInvitations.useQuery(
      { workspaceId: workspaceId ? workspaceId : "" },
      { enabled: Boolean(workspaceId), staleTime: 1000 * 60 * 5 }
    );

  return (
    <>
      {isLoading ? (
        <PendingInvitationsListSkeleton numberOfItems={2} />
      ) : (
        <div className="flex flex-col gap-5">
          {pendingInvitations?.length !== 0 ? (
            <>
              {pendingInvitations?.map((invitation) => {
                return (
                  <PendingInviteRow
                    key={invitation.id}
                    invitation={invitation}
                  />
                );
              })}
            </>
          ) : (
            <div className="rounded-xl bg-gray-100 px-4 py-4 text-center text-neutral-500">
              No pending invitations found
            </div>
          )}
        </div>
      )}
    </>
  );
}
export function PendingInvitationsListSkeleton({
  numberOfItems = 2,
}: {
  numberOfItems?: number;
}) {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: numberOfItems }).map((_, index) => {
        return <PendingInviteRowSkeleton key={index} />;
      })}
    </div>
  );
}

function RoleSelector({
  CurrentUserRole,
}: {
  CurrentUserRole: WorkspaceMemberRoles | undefined;
}) {
  return (
    <Field name="role">
      {({ form, meta }: FieldProps<WorkspaceMemberRoles>) => (
        <Select
          value={meta?.value}
          onValueChange={(value) => {
            form.setFieldValue("role", value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {CurrentUserRole && (
              <>
                {ALLOWED_ROLES_TO_INVITE[CurrentUserRole].map(
                  (role, roleIdx) => (
                    <SelectItem key={roleIdx} value={role}>
                      {role}
                    </SelectItem>
                  )
                )}
              </>
            )}
          </SelectContent>
        </Select>
      )}
    </Field>
  );
}
