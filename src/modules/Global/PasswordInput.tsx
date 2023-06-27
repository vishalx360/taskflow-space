import { Field, type FieldProps } from "formik";
import { useCallback, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

function PasswordInput({ name = "password" }: { name?: string }) {
  const [hidden, setHidden] = useState(true);

  const hide = useCallback(() => {
    setTimeout(() => {
      setHidden(true);
      console.log("hide");
    }, 10000);
  }, []);

  const show = useCallback(() => {
    console.log("show");
    setHidden(false);
  }, []);

  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <div>
          <label
            htmlFor={name}
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <div className="relative flex items-center gap-0">
            <input
              type={hidden ? "password" : "text"}
              id={name}
              placeholder="password"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-3 text-gray-900 focus:border-black focus:ring-black dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
              {...field}
            />
            <button
              className="absolute right-2 rounded-xl p-3  dark:text-white"
              type="button"
              onMouseDown={show}
              onMouseUp={hide}
            >
              {hidden ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {meta.touched && meta.error && (
            <p className="ml-2 mt-2 text-sm text-red-500">{meta.error}</p>
          )}
        </div>
      )}
    </Field>
  );
}

export default PasswordInput;
