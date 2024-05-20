import DepartmentTable from "@/pages/utilities/DepartmentTable";
import OperatorTable from "@/pages/utilities/OperatorTable";
import { useEffect, useState } from "react";
import ArrowDownUp from "../utilities/ArrowDownUp";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/reducer";
import {
  Message,
  Notification,
  TickSquare,
  TimeCircle,
  People,
} from "react-iconly";
import MyModal from "./StkModal";
import { io } from "socket.io-client";
import {
  GET_CONTACT_LIST,
  GET_DEPARTMENT_LIST,
  ORGANIZATION_DETAILS,
} from "@/Graphql/queries";
import { useQuery } from "@apollo/client";

const OrganizationDetails = () => {
  const [orgDetails, setOrgDetails] = useState<any>("");
  const [showMyModal, setShowMyModal] = useState(false);
  const [balance, setBalance] = useState(0);
  const [contacts, setContacts] = useState([] as any[]);

  const id = useSelector((state: RootState) => state.organization.id);

  const { data: data3 } = useQuery(ORGANIZATION_DETAILS, {
    variables: {
      organizationDetailsId: id,
    },
  });
  useEffect(() => {
    try {
      if (data3 && data3.organizationDetails) {
        const orgName = data3.organizationDetails.name;
        setOrgDetails(orgName);
      }
    } catch (err) {
      console.log(err);
    }
  }, [data3]);

  const { data: data1 } = useQuery(GET_DEPARTMENT_LIST, {
    variables: {
      organizationId: id,
    },
    onCompleted: (data) => {
      if (data && data.departmentsList) {
        const smsBalance = data.departmentsList.map(
          (bal: any) => bal.smsBalance
        );
        setBalance(smsBalance);
      }
    },
  });

  const { data: data2 } = useQuery(GET_CONTACT_LIST, {
    variables: {
      organizationId: id,
    },
    onCompleted: (data) => {
      if (data && data.contactsList) {
        const extractedNames = data.contactsList.map(
          (contact: any) => contact.name
        );
        setContacts(extractedNames.length);
      }
    },
  });

  useEffect(() => {
    const socket = io("https://artemis-messages-api-production.up.railway.app");
    socket.on("connect", () => {});
    socket.on(`update_sender_name_balance_${id}`, (department) => {
      setBalance(department.smsBalance);
    });
  }, []);

  const closeTheModal = () => {
    setShowMyModal(false);
  };

  return (
    <>
      <div className="flex justify-between w-full bg-gray-50 first-letter">
        <div className=" my-8 mx-auto w-3/5 max-md:w-full md:w-3/5 md:mx-auto max-md:mx-2 max-sm:w-full max-sm:px-1 ">
          {/* Top Navigation */}
          <div className="flex items-center justify-between ">
            <div className="ml-0">
              <embed className="w-24 h-20" src="/Vector.svg" type="" />
            </div>
            <div className="flex items-center justify-between gap-10 max-sm:gap-5">
              <Message set="curved" primaryColor="black" size={20} />
              <Notification set="curved" size={20} />
              <h2 className="rounded-lg bg-indigo-600 p-2 text-white text-xs font-medium">
                SB
              </h2>
              <ArrowDownUp />
            </div>
          </div>

          {/* Top-Nav under */}
          {/* header */}
          <h1 className="mt-2 font-normal text-lg">{orgDetails}</h1>

          <div className=" rounded-2xl border-gray-100 shadow-lg mt-4 flex items-center justify-between max-sm:flex-col md:w-full">
            <div className="p-4 w-1/2 text-white rounded-2xl bg-indigo-500 relative max-sm:w-full md:w-1/2 max-sm:p-3 max-sm:mb-3">
              <div className="ml-5">
                <h4 className="text-sm pb-2 max-sm:text-lg">Account Balance</h4>
                <h1 className="text-4xl pb-2 font-bold tracking-wider max-sm:text-5xl">
                  KES {orgDetails && Math.floor(balance * 0.6)}
                </h1>
                <p className="pb-2 text-sm max-sm:font-medium">
                  SMS Balance {balance}
                </p>
                <button
                  onClick={() => {
                    setShowMyModal(true);
                  }}
                  className="bg-pink-400 py-2 px-6 rounded-md text-sm max-sm:text-xs"
                >
                  Top Up Your Account
                </button>
              </div>
              <div className="absolute left-40 top-0 max-sm:absolute max-sm:left-32 max-sm:top-0">
                <embed className="w-36 h-32" src="/Wallet.svg" />
              </div>
            </div>

            <div className="mr-1 w-1/2 ml-10 max-sm:ml-5 max-sm:w-full md:w-1/2">
              {/* Top Div */}

              <div className=" flex items-center justify-between bg-teal-50 px-2 mr-4 mt-2 rounded-lg text-sm max-sm:text-sm max-sm:mt-0 gap-15">
                <div className="p-3 max-sm:p-3 flex items-center">
                  <TickSquare set="curved" primaryColor="green" size={20} />
                  <h1 className="ml-3">Messages Sent</h1>
                </div>
                <div className="p-2">1.24K SMS</div>
              </div>
              {/* Center Div */}

              <div className=" flex items-center justify-between bg-orange-50 px-2 mr-4 my-3 text-sm rounded-lg max-sm:text-sm max-sm:my-2 gap-15 ">
                <div className="p-3 max-sm:p-2 flex items-center">
                  <TimeCircle set="curved" primaryColor="orange" size={20} />
                  <h1 className="ml-3">Last Message</h1>
                </div>

                <div className="p-2 max-sm:p-0">23/01/2023 16:45pm</div>
              </div>

              {/* Bottom Div */}

              <div className=" flex items-center justify-between bg-blue-50 px-2 mr-4 mb-3 rounded-lg text-sm max-sm:text-sm max-sm:mb-1 gap-15">
                <div className="p-3 max-sm:p-3 flex items-center">
                  <People set="curved" primaryColor="blue" size={20} />
                  <h1 className="ml-3">Contacts</h1>
                </div>
                <div className="p-2">{contacts}</div>
              </div>
            </div>
          </div>

          {/* operator table */}

          {id && <OperatorTable id={id} />}

          {/* Department table */}
          {id && <DepartmentTable id={id} />}

          {/* My Modal */}
          <MyModal visible={showMyModal} closeModal={closeTheModal} />
        </div>
      </div>
    </>
  );
};

export default OrganizationDetails;
