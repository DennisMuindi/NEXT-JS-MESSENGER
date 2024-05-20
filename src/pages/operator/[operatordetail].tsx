import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/reducer";
import { GET_CONTACT_LIST } from "@/Graphql/queries";
import { GET_ALL_ROOMS } from "@/Graphql/queries";
import { GET_ALL_ROOMS_MESSAGES } from "@/Graphql/queries";
import {
  Message,
  Notification,
  TickSquare,
  TimeCircle,
  People,
  Call,
} from "react-iconly";
import MyModal from "../utilities/MyModal";
import { useQuery } from "@apollo/client";

const OperatorDetails = () => {
  const [contacts, setContacts] = useState([] as any[]);
  const [messages, setMessages] = useState([] as any[]);
   const [lastFormattedTime, setLastFormattedTime] = useState("");

  const handleLastFormattedTime = (formattedTime: any) => {
    setLastFormattedTime(formattedTime);
  };

  const id = useSelector((state: RootState) => state.organization.id);
  const operator = useSelector((state: RootState) => state.operator.operator);
  const operatorId = useSelector(
    (state: RootState) => state.operator.operatorId
  );
  const departmentId = useSelector(
    (state: RootState) => state.department.departmentId
  );

  const { data } = useQuery(GET_ALL_ROOMS, {
    variables: {
      roomParams: {
        operatorId: operatorId,
      },
    },
  });
  useEffect(() => {
    if (data && data.getAllRooms) {
      const extractedNames = data.getAllRooms.map(
        (contact: any) => contact.contacts
      );
      setContacts(extractedNames.length);
      const extractedMessages = data.getAllRooms.map(
        (message: any) => message.id
      );
      setMessages(extractedMessages.length);
    }
  });

  const { data: data1 } = useQuery(GET_ALL_ROOMS_MESSAGES, {
    variables: {
      roomParams: {
        operatorId: operatorId,
      },
    },
  });

  useEffect(() => {
    if (data1 && data1.getAllRooms.length > 0) {
      const lastRoom = data1.getAllRooms[data1.getAllRooms.length - 1];
      const lastMessage = lastRoom.messages[lastRoom.messages.length - 1];
      const date = new Date(lastMessage.timeStamp - 1000);
      const formattedTime = date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      setLastFormattedTime(formattedTime);
    }
  }, []);
  return (
    <>
      <div className="flex justify-between w-full bg-gray-50 first-letter">
        <div className=" my-8 mx-auto w-3/5 max-md:w-full md:w-3/5 md:mx-auto max-md:mx-2 max-sm:w-full max-sm:px-1 ">
          {/* Top Navigation */}
          <div className="flex items-center justify-between ">
            <div className="ml-0">
              <embed className="w-24 h-20" src="/Vector.svg" type="" />
            </div>
            <div className="flex items-center justify-between gap-8 max-sm:gap-5">
              <Message set="curved" primaryColor="black" size={20} />
              <Notification set="curved" size={20} />
              <h2 className="rounded-lg bg-indigo-600 p-2 text-white text-xs font-medium">
                SB
              </h2>
            </div>
          </div>
          <h1 className="my-4 font-light text-indigo-800 text-sm uppercase ">
            {operator && operator.name} Details
          </h1>
          <div className=" flex items-center justify-between bg-teal-100 px-2 mr-4 mb-3 rounded-lg text-sm max-sm:text-sm max-sm:mt-0 gap-15">
            <div className="p-3 max-sm:p-3 flex items-center">
              <TickSquare set="curved" primaryColor="green" size={20} />
              <h1 className="ml-3">Messages Sent</h1>
            </div>
            <div className="p-2">1.24K SMS</div>
          </div>

          <div className=" flex items-center justify-between px-2 mr-4 mt-5 rounded-lg text-sm max-sm:text-sm max-sm:mt-0 gap-15 bg-orange-100">
            <div className="p-3 max-sm:p-2 flex items-center">
              <TimeCircle set="curved" primaryColor="orange" size={20} />
              <h1 className="ml-3">Last Message</h1>
            </div>
            <div className="p-2 max-sm:p-0">{lastFormattedTime}</div>
          </div>

          <div className=" flex items-center justify-between bg-blue-100 px-2 mr-4 mt-3 rounded-lg text-sm max-sm:text-sm max-sm:mb-1 gap-15">
            <div className="p-3 max-sm:p-3 flex items-center">
              <People set="curved" primaryColor="blue" size={20} />
              <h1 className="ml-3">Contacts</h1>
            </div>
            <div className="p-2">{contacts}</div>
          </div>
          <div className="mt-7 ">
            <div className="relative font-medium">
              All Messages
              <span className=" p-2 border-2 bg-gray-800 font-light text-xs absolute top-5 left-1 text-gray-400 opacity-0 transition-opacity duration-300 hover:opacity-100 cursor-pointer">
                See Messages
              </span>
              <div className="font-thin w-full">
                {data1 && data1.getAllRooms.length > 0 ? (
                  data1.getAllRooms.map((room: any, index: any) => (
                    <div
                      key={index}
                      className="border rounded-lg px-4 py-3 my-4 text-sm shadow-md"
                    >
                      <h2 className="font-semibold mb-3 text-xl bg-indigo-600 text-white p-2 rounded">
                        {room.contacts.map((cont: any, contactIndex: any) => {
                          return (
                            <h2
                              key={contactIndex + 1}
                              className="capitalize max-sm:text-sm"
                            >
                              {cont.name} Messages
                            </h2>
                          );
                        })}
                      </h2>

                      <ul className="space-y-2">
                        {room.messages.map(
                          (message: any, messageIndex: any) => {
                            const date = new Date(message.timeStamp - 1000);
                            const formattedTime = date.toLocaleString("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              // second: "2-digit",
                            });
                           
                            return (
                              <li
                                key={messageIndex}
                                className="flex items-center justify-between"
                              >
                                <span className="font-normal capitalize text-sm bg-gray-300 rounded-md p-3">
                                  {message.content}
                                </span>
                                <span className=" font-normal text-xs bg-blue-100 p-2 rounded-3xl">
                                  {formattedTime}
                                </span>
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>
                  ))
                ) : (
                  <div className="border rounded-lg px-4 py-3 my-4 text-lg shadow-md text-center">
                    No messages available at this time
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OperatorDetails;
