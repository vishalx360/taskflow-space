import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/modules/ui/accordion";
import { Button } from "@/modules/ui/button";
import { ALLOWED_ROLES_TO_INVITE } from "@/utils/AllowedRolesToInvite";
import { CreateWorkspaceInvitation } from "@/utils/ValidationSchema";
import { api } from "@/utils/api";
import { Listbox, Transition } from "@headlessui/react";
import { type WorkspaceMemberRoles } from "@prisma/client";
import { ErrorMessage, Field, Form, Formik, type FieldProps } from "formik";
import { Fragment } from "react";
import { BiCheck, BiChevronDown } from "react-icons/bi";
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
                    <input
                      type="email"
                      id="email"
                      className="block h-full w-full rounded-l-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-black focus:ring-black sm:text-sm"
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
        <Listbox
          value={meta?.value}
          onChange={(e) => {
            form.setFieldValue("role", e);
          }}
        >
          <div className="relative ">
            <Listbox.Button className="w-fit rounded-r-lg border-2 bg-neutral-200 px-5 py-2.5 text-center text-sm font-medium text-black transition-all hover:bg-neutral-300 focus:outline-none focus:ring-1 focus:ring-black ">
              <span className="block truncate capitalize">
                {meta?.value.toLowerCase()}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <BiChevronDown
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {CurrentUserRole && (
                <Listbox.Options className="absolute mt-1 max-h-60 w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {ALLOWED_ROLES_TO_INVITE[CurrentUserRole].map(
                    (role, roleIdx) => (
                      <Listbox.Option
                        key={roleIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-neutral-200 text-black"
                              : "text-gray-900"
                          }`
                        }
                        value={role}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate capitalize ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {role.toLowerCase()}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black">
                                <BiCheck
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    )
                  )}
                </Listbox.Options>
              )}
            </Transition>
          </div>
        </Listbox>
      )}
    </Field>
  );
}
