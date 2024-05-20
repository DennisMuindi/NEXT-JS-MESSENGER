import { useEffect, useState } from "react";
import MyModal from "./MyModal";
import { Message, Call, TwoUsers, AddUser } from "react-iconly";
import { useMutation, useQuery } from "@apollo/client";
import { GET_DEPARTMENT_LIST, GET_OPERATORS_LIST } from "../../Graphql/queries";
import { CREATE_DEPARTMENT, DELETE_DEPARTMENT } from "@/Graphql/mutations";
import Delete from "./Delete";

const DepartmentTable = ({
  id,
}: {
  id: string | string[] | undefined | {} | null;
}) => {
  const [showMyModal, setShowMyModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [operatorList, setOperatorList] = useState<any>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [departmentList, setDepartmentList] = useState<any>([]);
  const [newDepartment, setNewDepartment] = useState();
  const [CreateDepartment, {}] = useMutation(CREATE_DEPARTMENT);
  const [DeleteDepartment, {}] = useMutation(DELETE_DEPARTMENT);
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>("");
  const [selectedOperatorName, setSelectedOperatorName] = useState<string>("");

  const [info, setInfo] = useState({
    name: "",
    senderName: "",
    phone: "",
  });

  const handleDelete = (id: any) => {
    try {
      const deleteDepartment = DeleteDepartment({
        variables: {
          departmentId: id,
        },
      });
      reloadDepartments();
    } catch (error) {}
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const newDepartment = await CreateDepartment({
        variables: {
          department: {
            name: info.name,
            phoneNumber: info.phone,
            senderName: info.senderName,
            organizationId: id,
          },
        },
      });
      if (newDepartment.data && newDepartment.data.CREATE_ORGANIZATION) {
        setNewDepartment(newDepartment.data);
      }
      reloadDepartments();
    } catch (error) {
      console.log("An Error occured", error);
    }
    handleSave();
  };

  const { data: data1, refetch: reloadDepartments } = useQuery(
    GET_DEPARTMENT_LIST,
    {
      variables: { organizationId: id },
    }
  );
  useEffect(() => {
    if (data1 && data1.departmentsList) {
      setDepartmentList(data1.departmentsList);
    }

    // if (data1 && data1.departmentsList) {
    //   const deptId = data1.departmentsList.map((bal: any) => bal.id);
    //   setDeptId(deptId);

    // }
  }, [data1]);

  const { data: data2 } = useQuery(GET_OPERATORS_LIST, {
    variables: { organizationId: id },
  });
  useEffect(() => {
    if (data2 && data2.operatorsList) {
      const operators = data2.operatorsList.map(
        (operator: any) => operator.name
      );
      setOperatorList(operators.length);
    }
  });

  const handleChange = (event: any) => {
    setInfo({
      ...info,
      [event.target.name]: event.target.value,
    });
  };

  // Close the modal/ popup
  const closeTheModal = () => {
    setShowMyModal(false);
  };
  const handleSave = () => {
    setIsLoading(true);
    setInfo({
      name: "",
      senderName: "",
      phone: "",
    });
    setIsPopupVisible(true);
    setTimeout(() => {
      setIsLoading(false);
      closeTheModal();
    }, 5000);
  };

  return (
    <>
      <div className="mt-12 mb-12">
        <div className="flex items-center justify-between">
          <h1 className="font-medium">Departments</h1>
          <div className="bg-teal-50 p-2 rounded-lg flex items-center">
            <AddUser set="curved" primaryColor="blue" size={16} />
            <button
              onClick={() => {
                setShowMyModal(true);
              }}
              className="text-indigo-600 text-sm ml-2"
            >
              Add Department
            </button>
          </div>
        </div>

        <div className="mt-1 border rounded-t-lg overflow-hidden max-sm:overflow-auto">
          <table className="border-gray-300 p-1 min-w-full ">
            <thead className="bg-gray-100 border-b-2 text-sm p-2">
              <tr className="">
                <th className="px-4 py-2 text-left text-sm font-bold">
                  <div className="flex items-center">
                    <div className="mr-2"></div>
                    <div className="truncate">#</div>
                  </div>
                </th>
                <th className="px-4 py-4 text-left text-sm font-bold ">
                  <div className="flex items-center">
                    <div className="mr-2"></div>
                    <div className="truncate">Name</div>
                  </div>
                </th>
                <th className="px-4 py-4 text-left text-sm font-bold ">
                  <div className="flex items-center">
                    <div className="mr-2"></div>
                    <div className="truncate">SenderName</div>
                  </div>
                </th>
                <th className="px-4 py-4 text-left text-sm font-bold ">
                  <div className="flex items-center">
                    <div className="mr-2">
                      {" "}
                      <TwoUsers set="curved" primaryColor="black" size={18} />
                    </div>
                    <div className="truncate">Operators</div>
                  </div>
                </th>
                <th className="px-4 py-4 text-left text-sm font-bold ">
                  <div className="flex items-center">
                    <div className="mr-2">
                      <Message set="curved" primaryColor="black" size={18} />
                    </div>
                    <div className="truncate">SMS Balance</div>
                  </div>
                </th>
                <th className="px-4 py-4 text-left text-sm font-bold ">
                  <div className="flex items-center">
                    <div className="mr-2">
                      <Call set="curved" primaryColor="black" size={18} />
                    </div>
                    <div className="truncate">Phone Number</div>
                  </div>
                </th>
                <th className="px-4 py-4 text-left text-sm font-bold ">
                  <div className="flex items-center">
                    <div className="truncate">Action</div>
                  </div>
                </th>
              </tr>
            </thead>

            {/* ************Table body****************** */}

            <tbody className="text-center bg-white m-0  text-neutral-800 max-sm:text-xs text-sm">
              {data1 && data1.departmentsList ? (
                data1.departmentsList.map((item: any, index: any) => (
                  <tr className="border-b border-gray-200" key={item.id}>
                    <td className="p-4 max-sm:p-3 ">{index + 1}</td>
                    <td className="p-4 max-sm:p-3 text-black font-medium">
                      {item.name}
                    </td>

                    <td className="p-4 max-sm:p-3">{item.senderName}</td>
                    <td className="p-4 max-sm:p-3">{operatorList}</td>
                    <td className="p-4 max-sm:p-3">{item.smsBalance}</td>
                    <td className="p-4 max-sm:p-3">{item.phoneNumber}</td>
                    <td className="p-4 max-sm:p-3">
                      <button
                        className="text-red-600"
                        onClick={() => {
                          setSelectedOperatorName(item.name);
                          setSelectedOperatorId(item.id);
                          setShowUpdateModal(true);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-sm text-gray-500"
                  >
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Delete visible={showUpdateModal} closeModal={closeTheModal}>
            <div className="p-4 m-2 mt-4">
              <div className="block text-gray-900 text-center pb-3">
                <label>
                  Are you sure you want to delete{" "}
                  <span className="text-gray-900 font-medium uppercase ">
                    {" "}
                    {selectedOperatorName} Department
                  </span>
                  ?{" "}
                </label>
              </div>
              <div className="w-full pb-4"></div>

              <div className=" flex items-center justify-between text-white">
                <button
                  type="submit"
                  className="text-center  bg-red-500 rounded px-5 p-2"
                  onClick={() => {
                    handleDelete(selectedOperatorId);
                    closeTheModal();
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowUpdateModal(false);
                  }}
                  className="text-center bg-indigo-600 rounded px-6 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Delete>

          <MyModal visible={showMyModal} closeModal={closeTheModal}>
            <form onSubmit={handleSubmit} className="p-4 m-4">
              <h1 className="text-xl font-medium mb-7 max-sm:text-center max-sm:text-lg">
                Add A Department
              </h1>
              <div className="flex justify-between items-center max-sm:flex-col">
                <div className="w-1/2 pr-2 max-sm:w-full mr-5">
                  <label className="block pd-3 mb-1 text-sm">
                    Enter Name Of Department
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={info.name}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    placeholder="What is the name your Department?"
                    className="w-full p-3 rounded-lg border text-sm max-sm:text-xs border-gray-200 outline-none"
                  />
                </div>
                <div className="w-1/2 pr-2 max-sm:w-full max-sm:mt-2 max-sm:mr-5 ">
                  <label className="block pd-3 mb-1 text-sm">
                    Department Contact Information
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={info.phone}
                    onChange={handleChange}
                    autoComplete="off"
                    placeholder="Enter Department Tel Number"
                    className="w-full p-3 mr-5 outline-none text-black text-sm rounded-lg border border-gray-200"
                  />
                </div>
              </div>

              <div className="w-1/2 pr-2 max-sm:w-full mt-8 mr-5  ">
                <label className="block pd-3 mb-1 text-sm max-sm:text-xs">
                  Your Prefered sender name (optional)
                </label>
                <input
                  name="senderName"
                  type="text"
                  value={info.senderName}
                  onChange={handleChange}
                  autoComplete="off"
                  maxLength={11}
                  placeholder="The Sender Name is shown on the recepient"
                  className="max-sm:text-xs w-full p-3 rounded-lg border text-sm border-gray-200 outline-none"
                />
              </div>

              <div className="mt-8 border-t-2 border-gray-200 pt-7 flex items-center gap-12 max-sm:mt-6 max-sm:gap-8">
                <button
                  className="py-3 px-7 w-1/4 h-12 text-sm font-medium rounded-lg text-white bg-indigo-600 max-sm:py-2 sm:px-2 max-sm:text-start max-sm:w-full max-sm:text-xs max-sm:px-3"
                  type="submit"
                >
                  {isLoading ? (
                    <div>
                      Saving{" "}
                      <embed
                        src="/loader.svg"
                        className="animate-spin ease-in-out inline-block ml-4"
                        type=""
                      />
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  type="reset"
                  className="text-sm text-red-500 max-sm:w-full max-sm:text-xs"
                >
                  Discard Changes
                </button>
              </div>
            </form>
          </MyModal>
        </div>
      </div>
    </>
  );
};

export default DepartmentTable;
