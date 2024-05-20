import { useEffect, useState } from "react";
import axios from "axios";
import { RootState } from "@/Redux/reducer";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@apollo/client";
import { STKPUSH } from "@/Graphql/mutations";
import { GET_DEPARTMENT_LIST } from "@/Graphql/queries";

export default function MyModal({
  visible,
  closeModal,
}: {
  visible: any;
  closeModal: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [department, setDepartment] = useState("");
  const [StkPushPayment, {}] = useMutation(STKPUSH);
  const [payment, setPayment] = useState({
    phoneNumber: "",
    amount: 1,
  });
  const id = useSelector((state: RootState) => state.organization.id);

  const { data: data1 } = useQuery(GET_DEPARTMENT_LIST, {
    variables: {
      organizationId: id,
    },
  });
  const dept = data1 && data1.departmentsList[0].id;

  useEffect(() => {
    setDepartment(dept);
  }, []);

  if (!visible) return null;
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const newStk = await StkPushPayment({
          variables: {
            stkPush: {
              amount: 1,
              description: "confirmed",
              sender: "sender",
              reference: "RQW8765TFR",
            },
          },
        });

        if (newStk.data && newStk.data.STKPUSH) {
          setPayment(newStk.data);
        }
      } catch (error) {}
    }, 1000);
    setIsLoading(false);
    closeModal();
    setPayment({ phoneNumber: "", amount: 0 });
  };
  const handleClose = (event: any) => {
    if (event.target.id === "container") closeModal();
  };

  const handleChange = (event: any) => {
    setPayment({
      ...payment,
      [event.target.name]: event.target.value,
    });
  };
  return (
    <div
      id="container"
      onClick={handleClose}
      className="fixed inset-0 bg-black bg-opacity-30  backdrop-blur-sm flex justify-center 
             items-center opacity-100 "
    >
      <div className="bg-white rounded-3xl w-1/4 max-sm:w-5/6 transform transition-all duration-300 ease-in-out">
        <form onSubmit={handleSubmit} className="p-4 m-4">
          <h1 className="text-2xl text-indigo-500 text-center font-medium mb-7 max-sm:text-center max-sm:text-lg">
            Topup Your Account
          </h1>
          <div className="flex justify-center items-center max-sm:flex-col">
            <input
              type="text"
              name="phoneNumber"
              placeholder="Enter your phone Number"
              // autoComplete="off"
              value={payment.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 outline-none border-gray-500 border rounded text-sm font-medium"
            />
          </div>
          <div className="mt-5 flex justify-center items-center max-sm:flex-col">
            <input
              type="text"
              name="amount"
              placeholder="Enter amount in KSH"
              value={payment.amount}
              onChange={handleChange}
              className="w-full p-2  outline-none border-gray-500 border rounded text-sm font-medium"
            />
          </div>
          <div className="mt-8 border-t-2 border-gray-200 pt-7 flex items-center justify-center max-sm:mt-6 max-sm:gap-8">
            <button
              className="py-2 px-2 w-full h-12 text-lg font-medium rounded text-white bg-indigo-600 max-sm:py-2 sm:px-2 max-sm:text-center max-sm:w-full max-sm:text-xs max-sm:px-3"
              type="submit"
            >
              {isLoading ? (
                <div>
                  Sending{" "}
                  <embed
                    src="/loader.svg"
                    className="animate-spin ease-in-out inline-block ml-4"
                    type=""
                  />
                </div>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
