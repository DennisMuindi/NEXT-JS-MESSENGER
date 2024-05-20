import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { OAuthExtension } from "@magic-ext/oauth";
import { Magic } from "magic-sdk";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { LoginOrSignUp } from "../Graphql/mutations";
import { useMutation, useQuery } from "@apollo/client";

const initialValues = {
  phone: "",
};

const Login = () => {
  const [signUp, { loading, error, data }] = useMutation(LoginOrSignUp);
  const [number, setNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  useEffect(() => {
    const magic = new Magic(`${process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY}`);
    magic.user.isLoggedIn().then((isLoggedIn) => {
      if (!isLoggedIn) {
        return;
      }
      magic.user.getMetadata().then((metadata) => {
        signUp({
          variables: {
            authRequest: {
              publicAddress: metadata.publicAddress,
              
            },
          },
        });
      });
    });
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    
    if (!number) return;
    setIsLoading(true);
    const magic = new Magic(
      `${process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY}`,
      {
        extensions: [new OAuthExtension()],
      }
    );

 
    try {
      let dIdToken = await magic.auth.loginWithSMS({
        phoneNumber: number,
      });
      
      if (dIdToken) {
    
        const g = await signUp({
          variables: {
            authRequest: {
              didToken: dIdToken,
              
            },
          },
        });
        if(g.data && g.data.loginOrSignup.token){
          localStorage.setItem("token", g.data.loginOrSignup.token);
          router.push("/success");
        }
       
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setErrorMessage("Please try again later.");
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-50 ">
        <div className="w-1/3 flex items-center mx-auto my-4 p-11 md:p-8 max-sm:w-full max-sm:mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-center ">
              <embed src="/Vector.svg" />
            </div>
            <div className="pt-4">
              <h1 className="font-semibold text-2xl text-center max-sm:text-xl">
                Welcome Back
              </h1>
              <p className="pt-3 text-center font-normal max-sm:text-xs max-sm:text-justify">
                To get started, please enter your phone number below. We will
                send a verification code that will allow you to log in
                instantly.
              </p>
            </div>

            <div className="input-field">
              <PhoneInput
                type="tel"
                placeholder="Enter your phone number"
                international
                defaultCountry="KE"
                className="phone-input"
                value={number}
                onChange={(number: string) => setNumber(number)}
                error={
                  number
                    ? isValidPhoneNumber(number)
                      ? undefined
                      : "Invalid phone number"
                    : "Phone number required"
                }
              />
            </div>
            <div className="text-sm font-light text-center p-1 md:text-justify max-sm:text-xs max-sm:text-justify">
              <p>
                Once you have entered your phone number, simply check your
                messages for the verification code we have sent you. Enter the
                code on the next screen, and you will be logged in
                automatically.
              </p>
            </div>
            <div className="my-btn-wrapper">
              {!isLoading && (
                <button
                  className="my-btn"
                  type="submit"
                  disabled={!isValidPhoneNumber(number)}
                >
                  Sign in
                </button>
              )}
              {isLoading && (
                <div className="my-btn">
                  <embed
                    className="inline-block animate-spin"
                    width={20}
                    src="/loader.svg"
                  />
                </div>
              )}
              {errorMessage && (
                <p className="text-center text-red-500 text-sm">
                  {" "}
                  {errorMessage}{" "}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default Login;
