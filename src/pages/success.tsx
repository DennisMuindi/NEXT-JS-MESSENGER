import RedirectingLoader from "./redirect";

const Success = () => {
  return (
    <>
      <div className="flex items-center justify-center h-screen w-full my-0 mx-auto">
        <div className="w-1/2 max-sm:w-full">
          <RedirectingLoader />
          <div className="mt-4 mb-8 flex justify-center items-center max-sm:mb-5">
            <embed src="/Vector.svg" />
          </div>
          <div className="w-full max-sm:w-full mx-auto">
            <div className="w-full max-sm:w-full">
              <h1 className="text-center text-2xl text-black font-semibold max-sm:text-lg">
                Your account has been created successfully
              </h1>
            </div>

            <div className="w-3/4 max-sm:w-5/6 mx-auto">
              <p className="text-center px-20 py-5 text-base font-normal max-sm:px-2 max-sm:text-sm max-sm:py-3">
                To get started, we just need to verify your account. We have
                sent a confirmation code to the phone number you provided during
                sign-up.
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center m-3">
            <embed src="/success.svg" />
          </div>
          <div className="w-2/3 max-sm:w-5/6 max-sm:px-3 mx-auto ">
            <h1 className="text-center text-base font-normal">
              Please provide the activation code to your administrator to
              activate your account
            </h1>
            <p className="text-center max-sm:text-justify text-sm max-sm:text-xs font-light mt-4 max-sm:px-4">
              Once your account is activated, you will be able to access the
              dashboard and start exploring all the features our platform has to
              offer.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Success;
