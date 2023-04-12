import { Field, type FieldProps } from "formik";
import Image from "next/image";
import { FiCheckCircle } from "react-icons/fi";
import BoardBackGrounds from "@/utils/BoardBackgrounds.json";

function UpdateBoardBackgroundSection({
  UpdatelocalBackground,
}: {
  UpdatelocalBackground: (background: string) => void;
}) {
  return (
    <div className="mt-5">
      <p className="text-md mb-3 font-semibold text-neutral-500 dark:text-white">
        Board Background
      </p>

      <Field name="background">
        {({ field, form, meta }: FieldProps) => (
          <>
            <div>
              <h3 className="mb-2 block text-sm font-medium text-neutral-500 dark:text-white">
                Gradients
              </h3>
              <ul className="grid w-full grid-cols-5 gap-4 md:grid-cols-5">
                {BoardBackGrounds.gradients.map((gradient, index) => (
                  <li key={gradient}>
                    <input
                      type="radio"
                      id={`gradient:${index}`}
                      name="background"
                      value={`gradient:${gradient}`}
                      className="peer hidden"
                      onChange={(e) => {
                        form.setFieldValue("background", e.target.value);
                        UpdatelocalBackground(e.target.value);
                      }}
                    />
                    <label
                      htmlFor={`gradient:${index}`}
                      className="relative inline-flex w-fit cursor-pointer items-center justify-between overflow-hidden rounded-lg border-2 border-gray-200 bg-white  text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500"
                    >
                      {field.value === `gradient:${gradient}` && (
                        <div className="absolute flex h-full w-full items-center justify-center bg-black/30">
                          <FiCheckCircle className="text-2xl text-white" />
                        </div>
                      )}
                      <div
                        className={`aspect-video  w-[60px] md:w-[80px]`}
                        style={{ backgroundImage: gradient }}
                      />
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mt-3 mb-2 block text-sm font-medium text-neutral-500 dark:text-white">
                Wallpapers
              </h3>
              <ul className="grid w-full grid-cols-5 gap-2 md:grid-cols-5">
                {BoardBackGrounds.wallpapers.map((imageURL, index) => (
                  <li key={imageURL}>
                    <input
                      type="radio"
                      id={`wallpaper:${index}`}
                      name="background"
                      value={`wallpaper:${imageURL}`}
                      className="peer hidden"
                      onChange={(e) => {
                        form.setFieldValue("background", e.target.value);
                        UpdatelocalBackground(e.target.value);
                      }}
                    />
                    <label
                      htmlFor={`wallpaper:${index}`}
                      className="relative inline-flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg border-2 border-gray-200 bg-white  text-white  hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600"
                    >
                      {field.value === `wallpaper:${imageURL}` && (
                        <div className="absolute flex h-full w-full items-center justify-center bg-black/30">
                          <FiCheckCircle className="text-2xl text-white" />
                        </div>
                      )}
                      <Image
                        className="aspect-video w-full bg-gray-200 object-cover "
                        alt="background"
                        width={90}
                        height={40}
                        src={imageURL}
                      />
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {meta.touched && meta.error && (
              <p className="mt-2 ml-2 text-sm text-red-500">{meta.error}</p>
            )}
          </>
        )}
      </Field>
    </div>
  );
}

export default UpdateBoardBackgroundSection;
