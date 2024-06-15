"use client";

type Props = {
  title: string;
  description?: string;
  theme?: "light" | "dark";
  submitButtonText?: string;
  closeButtonText?: string;
  showModal: boolean;
  submitHandler?: () => void;
  closeHandler?: () => void;
};

const Modal: React.FC<Props> = ({
  title,
  description,
  theme = "dark",
  submitButtonText,
  closeButtonText,
  showModal,
  submitHandler,
  closeHandler,
}: Props) => {
  return (
    <div
      className={`${
        showModal ? "block" : "hidden"
      } fixed inset-0 z-50`}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black opacity-75"></div>
        </div>
        <span
          className="inline-block align-middle h-screen"
          aria-hidden="true"
        ></span>
        &#8203;
        <div
          className={`inline-block align-bottom ${
            theme === "dark" ? "bg-[#424242]" : "bg-[#f0f0f0]"
          } rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-lg w-auto md:w-full`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div
            className={`${
              theme === "dark" ? "bg-[#424242]" : "bg-[#f0f0f0]"
            } px-4 pt-5`}
          >
            <div className="flex items-start">
              <div className="mt-0 ml-4 text-left">
                <h3
                  className={`text-2xl leading-6 font-medium ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {title}
                </h3>
                {description &&
                <div className="mt-2">
                  <p
                    className={`text-lg ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    {description}
                  </p>
                </div>
                }
              </div>
            </div>
          </div>
          <div
            className={`${
              theme === "dark" ? "bg-[#424242]" : "bg-[#f0f0f0]"
            } px-4 py-3 flex flex-row-reverse`}
          >
            {submitButtonText && (
              <button
                type="button"
                className="inline-flex justify-center border border-transparent m-2 text-secondary text-lg font-medium focus:outline-none ml-3 w-auto"
                onClick={submitHandler}
              >
                {submitButtonText}
              </button>
            )}
            {closeButtonText && (
              <button
                type="button"
                className="inline-flex justify-center border border-transparent mx-4 my-2 text-secondary text-lg font-medium focus:outline-none ml-3 w-auto"
                onClick={closeHandler}
              >
                {closeButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
