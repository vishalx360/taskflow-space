import { useToast } from "@/hooks/use-toast";
import { RenamePasskeySchema } from "@/utils/ValidationSchema";
import { api } from "@/utils/api";
import { startRegistration } from "@simplewebauthn/browser";
import { Field, Form, Formik, type FieldProps } from "formik";
import {
  LucideAlertCircle,
  LucideCheck,
  LucideEdit,
  LucideKey,
  LucideTrash2,
  LucideX,
} from "lucide-react";
import { useState } from "react";
import { BiKey, BiMobile } from "react-icons/bi";
import ReactTimeago from "react-timeago";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ConfirmDialog } from "../Global/ConfirmDialog";

function PasskeySection() {
  const { toast } = useToast();
  const utils = api.useContext();

  const PasskeyVerifyReg = api.authentication.passkeyVerifyReg.useMutation({
    onError: (error) => {
      // remove optimistic update on error
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: (data) => {
      if (data && data.verified) {
        toast({
          title: "Passkey registered!",
        });
      } else {
        toast({
          title: "Passkey not registered!",
          variant: "destructive",
        });
      }
      utils.authentication.fethMyPasskeys.invalidate().catch((err) => {
        console.log(err);
      });
    },
  });

  async function HandelRegister() {
    const options = await utils.authentication.passkeyGenRegOpts.fetch();
    try {
      const GetCredentialResponse = await startRegistration(options);
      await PasskeyVerifyReg.mutate(GetCredentialResponse);
    } catch (error) {
      if (error?.name === "InvalidStateError") {
        toast({
          title: "Error: Passkey was probably already registered.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Some error occured registring.",
          variant: "destructive",
        });
      }
    }
  }

  const { data: passkeys } = api.authentication.fethMyPasskeys.useQuery();

  return (
    <div>
      <h2 className="text-xl font-medium">Passkeys</h2>
      <p className="my-5 text-neutral-700">
        Add a new passkey to your account. it can be security key, device
        fingerprint or a connected phone.
      </p>
      <div className="my-5 flex items-center justify-between">
        <h2 className="text-gray-500">Your passkeys</h2>
        <Button LeftIcon={LucideKey} onClick={HandelRegister} variant="outline">
          Register a new key
        </Button>
      </div>
      {/* show all connected passkey */}
      <div className=" flex flex-col space-y-2">
        {passkeys?.length !== 0 ? (
          <>
            {passkeys?.map((passkey) => (
              <PasskeyRow
                key={passkey.id}
                name={passkey.name}
                id={passkey.id}
                type="securitykey"
                createdAt={passkey.createdAt}
              />
            ))}
          </>
        ) : (
          <>
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-5">
                    <LucideAlertCircle className="h-8 w-8" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium capitalize">
                      No passkeys connected
                    </span>
                    <span className="text-xs text-neutral-500">
                      You have no passkeys connected to your account.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const IconMap = {
  securitykey: <BiKey className="h-10 w-10 -rotate-90" />,
  phone: <BiMobile className="h-10 w-10" />,
};

interface PasskeyRowProps {
  id: string;
  type: keyof typeof IconMap;
  createdAt: Date;
  name: string;
}
function PasskeyRow({ id, name, createdAt, type = "phone" }: PasskeyRowProps) {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const utils = api.useContext();
  const removeMutation = api.authentication.removePasskey.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: () => {
      toast({ title: `Passkey Removed` });
      utils.authentication.fethMyPasskeys
        .invalidate()
        .catch((err) => console.log(err));
    },
  });
  const renameMutation = api.authentication.renamePasskey.useMutation({
    onError(error) {
      toast({
        variant: "destructive",
        title: error.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        // action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSuccess: () => {
      toast({ title: `Passkey Renamed` });
      utils.authentication.fethMyPasskeys
        .invalidate()
        .catch((err) => console.log(err));
      setEditMode(false);
    },
  });

  return (
    <div className="rounded-md border p-4">
      <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
        <div className="flex items-center">
          <div className="mr-5">{IconMap[type]}</div>
          <div className="flex  flex-col gap-1">
            {editMode ? (
              <Formik
                initialValues={{ name, id }}
                validationSchema={toFormikValidationSchema(RenamePasskeySchema)}
                onSubmit={(values) => {
                  renameMutation.mutate(values);
                }}
              >
                <Form className="w-full">
                  <Label htmlFor="name" className="text-sm">
                    Rename Passkey
                  </Label>
                  <div className="my-2 flex w-full flex-col justify-between gap-2 md:flex-row md:items-center">
                    <Field name="name">
                      {({ field, form, meta }: FieldProps) => (
                        <Input
                          className="w-max font-medium"
                          id="name"
                          placeholder="Passkey name"
                          required
                          {...field}
                        />
                      )}
                    </Field>
                    <Field name="submit">
                      {({ form }: FieldProps) => (
                        <div className="flex items-center gap-2">
                          <Button
                            isLoading={renameMutation.isLoading}
                            disabled={
                              Object.keys(form.errors).length !== 0 ||
                              !form.dirty
                            }
                            type="submit"
                            LeftIcon={LucideCheck}
                          >
                            Rename
                          </Button>
                          <Button
                            variant="outline"
                            isLoading={renameMutation.isLoading}
                            type="button"
                            onClick={() => setEditMode(false)}
                            LeftIcon={LucideX}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </Field>
                  </div>
                  <Field name="name">
                    {({ form, meta }: FieldProps) => (
                      <>
                        {form.dirty && meta.touched && meta.error && (
                          <p className="mt-2  text-xs text-red-500">
                            {meta.error}
                          </p>
                        )}
                      </>
                    )}
                  </Field>
                </Form>
              </Formik>
            ) : (
              <p className="line-clamp-1 text-sm font-medium capitalize">
                {name}
              </p>
            )}
            <div>
              <p className="text-xs text-neutral-500">
                Added <ReactTimeago live={false} date={createdAt} />
              </p>
            </div>
          </div>
        </div>
        {!editMode && (
          <div className="flex gap-2">
            <Button
              size="sm"
              LeftIcon={LucideEdit}
              variant="outline"
              onClick={() => setEditMode(true)}
              className="px-4 text-xs"
            >
              Rename
            </Button>
            <ConfirmDialog
              description="Are you sure you want to remove this passkey?"
              title={`Remove Passkey : ${name}`}
              action={() => removeMutation.mutate({ id })}
            >
              <Button
                size="sm"
                isLoading={removeMutation.isLoading}
                LeftIcon={LucideTrash2}
                variant="destructiveOutline"
                className="px-4 text-xs"
              >
                Remove
              </Button>
            </ConfirmDialog>
          </div>
        )}
      </div>
    </div>
  );
}

export default PasskeySection;

// add ability to remove passkey

// add ability to rename passkey
// add ability to add type passkey
// add ability to authenticate with passkey
