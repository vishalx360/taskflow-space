import { Field, type FieldProps, Form, Formik } from "formik";
import geopattern from "geopattern";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toFormikValidationSchema } from "zod-formik-adapter";

import getGravatar from "@/utils/getGravatar";
import { CreateTaskSchema } from "@/utils/ValidationSchema";

import Divider from "../Global/Divider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/text-area";

function ProfileSection() {
  const { data: session } = useSession();

  return (
    <div className="max-w-2xl pb-20">
      <div className="flex flex-col items-center justify-center -space-y-10  ">
        {/* account intro */}
        <div className="relative -z-10 h-20 w-full overflow-hidden  rounded-xl md:h-32">
          <Image
            fill
            src={geopattern.generate(session?.user.email).toDataUri()}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className=" flex flex-col items-center justify-center gap-5 ">
          {session?.user?.email && (
            <Image
              height={200}
              width={200}
              // generate default gravtar image
              src={session?.user?.image || getGravatar(session?.user?.email)}
              alt="avatar"
              className="w-[70px] rounded-full ring-0 ring-gray-400 transition-all hover:ring-2 md:w-[90px]"
            />
          )}
          <div className="text-center">
            <h1 className="text-2xl font-medium">{session?.user.name}</h1>
            <h3 className="text-md text-neutral-800 ">{session?.user.email}</h3>
          </div>
        </div>
      </div>
      <div>
        <Divider />

        <div className="space-y-5">
          <Formik
            initialValues={{ name: "", bio: "", email: "" }}
            validationSchema={toFormikValidationSchema(CreateTaskSchema)}
            onSubmit={(values) => {
              alert(values);
              // mutation.mutate(values);
            }}
          >
            <Form>
              <div className=" space-y-5">
                <Field name="name">
                  {({ field, form, meta }: FieldProps) => (
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-neutral-500 dark:text-white"
                      >
                        Full Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Full Name"
                        id="name"
                        required
                        {...field}
                      />
                    </div>
                  )}
                </Field>
                <Field name="bio">
                  {({ field, form, meta }: FieldProps) => (
                    <div>
                      <label
                        htmlFor="bio"
                        className="mb-2 block text-sm font-medium text-neutral-500 dark:text-white"
                      >
                        Short Bio
                      </label>
                      <Textarea
                        placeholder="Bio"
                        id="bio"
                        required
                        {...field}
                      />
                    </div>
                  )}
                </Field>
                <div className="flex max-w-sm items-center gap-5">
                  <Field name="submit">
                    {({ form }: FieldProps) => (
                      <Button
                        loadingText=" "
                        disabled={Object.keys(form.errors).length !== 0}
                        type="submit"
                        className="flex-[2] rounded-xl"
                      >
                        Save Changes
                      </Button>
                    )}
                  </Field>
                  <Field name="submit">
                    {({ form }: FieldProps) => (
                      <Button
                        variant="subtle"
                        loadingText=" "
                        disabled={Object.keys(form.errors).length !== 0}
                        type="submit"
                        className="flex-[2] rounded-xl"
                      >
                        Cancel
                      </Button>
                    )}
                  </Field>
                </div>
              </div>
              <Field name="title">
                {({ form, meta }: FieldProps) => (
                  <>
                    {form.dirty && meta.touched && meta.error && (
                      <p className="ml-2 mt-2 text-sm text-red-500">
                        {meta.error}
                      </p>
                    )}
                  </>
                )}
              </Field>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default ProfileSection;
