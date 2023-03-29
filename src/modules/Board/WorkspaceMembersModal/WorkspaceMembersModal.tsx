import { Dialog, Disclosure, Listbox, Transition } from "@headlessui/react";
import {
  WorkspaceMemberInvitation,
  WorkspaceMemberRoles,
  type WorkspaceMember,
} from "@prisma/client";
import { ErrorMessage, Field, Form, Formik, type FieldProps } from "formik";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Fragment, useState } from "react";
import { BiCheck, BiChevronDown } from "react-icons/bi";
import { FaCaretRight } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { MdPeople } from "react-icons/md";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Divider from "~/modules/Global/Divider";
import IconButton from "~/modules/Global/IconButton";
import PrimaryButton from "~/modules/Global/PrimaryButton";
import Toast from "~/modules/Global/Toast";
import { ALLOWED_ROLES_TO_INVITE } from "~/utils/AllowedRolesToInvite";
import { api } from "~/utils/api";
import getGravatar from "~/utils/getGravatar";
import { InviteWorkspaceModalSchema } from "~/utils/ValidationSchema";
import { TaskListSkeleton } from "../TaskList";

export default function WorkspaceMembersModal({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const {
    data: members,
    isLoading,
    isRefetching,
  } = api.board.getWorkspaceMembers.useQuery({ workspaceId });
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  if (isLoading) {
    return <TaskListSkeleton NumberOfTasks={5} />;
  }

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  const CurrentUserRole = members?.find(
    (member) => member.user.email === session?.user.email
  )?.role;

  return (
    <>
      <IconButton
        onClick={openModal}
        Icon={MdPeople}
        className=" bg-neutral-400/20 transition-opacity hover:bg-neutral-400/40"
      >
        Members
      </IconButton>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform  rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex items-center justify-between gap-5 text-lg font-medium leading-6 text-gray-900 "
                  >
                    Workspace Members
                    <button
                      onClick={closeModal}
                      type="button"
                      className="rounded-lg p-2 text-xs text-inherit transition-all  hover:bg-neutral-500 hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-10"
                      aria-controls="navbar-default"
                      aria-expanded="false"
                    >
                      <span className="sr-only">Close Image Preview</span>
                      <FiX size="2em" />
                    </button>
                  </Dialog.Title>
                  <MembersList members={members} />
                  <Divider />
                  <InviteMember
                    CurrentUserRole={CurrentUserRole}
                    workspaceId={workspaceId}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
type UserType = {
  image: string | null;
  name: string | null;
  email: string | null;
};

type WorkspaceMemberWithUser = WorkspaceMember & {
  user: UserType;
};

type WorkspaceMemberInvitationWithUser = WorkspaceMemberInvitation & {
  user: UserType;
};

function MembersList({
  members,
}: {
  members: WorkspaceMemberWithUser[] | undefined;
}) {
  return (
    <div>
      <p className="text-md my-4">{members?.length} Members</p>
      <div className="flex flex-col gap-5">
        {members?.map((member) => {
          return <MemberRow key={member.id} member={member} />;
        })}
      </div>
    </div>
  );
}

function MemberRow({
  member,
}: {
  member: WorkspaceMemberWithUser | WorkspaceMemberInvitationWithUser;
}) {
  // get current user email
  const { data: session } = useSession();
  const { user } = member;
  return (
    <div key={user?.email} className="flex items-center gap-5 px-2">
      <Image
        height={20}
        width={20}
        className="h-14 w-14 rounded-full border-2 border-white dark:border-gray-800"
        src={
          user?.image ||
          (user.email && getGravatar(user.email)) ||
          getGravatar("default")
        }
        alt=""
      />
      <div className="flex w-full items-center justify-between ">
        <div>
          <h1>
            {user.name} {user.email === session?.user.email && "(You)"}
          </h1>
          <h2 className="text-neutral-600">{user.email}</h2>
        </div>
        <div className="w-fit rounded-xl border-2 bg-neutral-200/80 p-1 px-3 text-xs capitalize">
          {member.role.toLowerCase()}
        </div>
      </div>
    </div>
  );
}

function InviteMember({
  CurrentUserRole,
  workspaceId,
}: {
  CurrentUserRole: WorkspaceMemberRoles | undefined;
  workspaceId: string;
}) {
  const utils = api.useContext();
  const mutation = api.board.inviteMember.useMutation({
    onError(error) {
      Toast({ content: error.message, status: "error" });
    },
    onSuccess: async () => {
      await utils.board.getAllPendingInvitations
        .invalidate({ workspaceId })
        .catch((err) => console.log(err));
      // TODO: invalidate pending invites list
      Toast({ content: "Succesfully sent invite", status: "success" });
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
        validationSchema={toFormikValidationSchema(InviteWorkspaceModalSchema)}
        onSubmit={(values) => {
          mutation.mutate(values);
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

            <PrimaryButton
              overwriteClassname
              type="submit"
              className="ml-auto w-fit rounded-lg bg-black px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-1 focus:ring-black dark:bg-black dark:hover:bg-black dark:focus:ring-black"
              isLoading={mutation.isLoading}
              loadingText="Sending Invite"
            >
              Invite
            </PrimaryButton>
          </div>
          <div className="mt-2 ml-2 text-sm text-red-500">
            <ErrorMessage name="email" />
            <ErrorMessage name="role" />
          </div>
        </Form>
      </Formik>
      <PendingMembersList workspaceId={workspaceId} />
    </div>
  );
}

function PendingMembersList({
  workspaceId,
}: {
  workspaceId: string | undefined;
}) {
  function Panel() {
    const { data: pendingMembers } =
      api.board.getAllPendingInvitations.useQuery(
        { workspaceId: workspaceId ? workspaceId : "" },
        { enabled: !!workspaceId }
      );

    return (
      <div className="flex flex-col gap-5">
        {pendingMembers?.length !== 0 ? (
          <>
            {pendingMembers?.map((member) => {
              return <MemberRow key={member.id} member={member} />;
            })}
          </>
        ) : (
          <div className="rounded-xl bg-gray-100 px-4 py-4 text-center text-neutral-500">
            No pending invitations found
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/*  */}

      <Disclosure defaultOpen={false}>
        {({ open }) => (
          <>
            <div className="my-5 flex items-center gap-5">
              <Disclosure.Button className="w-full ">
                <div className="flex w-full items-center justify-between gap-10 rounded-xl rounded-t-xl border border-gray-200 px-5  hover:bg-neutral-100  ">
                  <div className="flex items-center gap-5">
                    <p className="text-md my-4">Pending Invitations</p>
                    {/* {isRefetching && (
                      <BiLoaderAlt className="h-5 w-5 animate-spin text-neutral-500" />
                    )} */}
                  </div>
                  <FaCaretRight
                    className={`${
                      open ? "rotate-90 transform" : ""
                    } h-5 w-5 text-inherit`}
                  />
                </div>
              </Disclosure.Button>
            </div>

            <Transition
              enter="transition duration-150 ease-in"
              enterFrom="transform  -translate-y-3 opacity-0"
              enterTo="transform translate-y-0  opacity-100"
              leave="transition duration-150 ease-out"
              leaveFrom="transform translate-y-0 opacity-100"
              leaveTo="transform -translate-y-3 opacity-0"
            >
              <Disclosure.Panel>
                <Panel />
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>

      {/*  */}
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
