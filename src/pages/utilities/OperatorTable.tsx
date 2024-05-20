import { useEffect, useState } from "react";
import MyModal from "./MyModal";
import axios from "axios";
import { Message, Call, TimeCircle, AddUser } from "react-iconly";
import Delete from "./Delete";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setOperatorDetails, setOperatorId } from "@/Redux/operatorSlice";
import { GET_DEPARTMENT_LIST, GET_OPERATORS_LIST } from "../../Graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_OPERATOR, MAKE_ADMIN } from "@/Graphql/mutations";
import { DELETE_OPERATOR } from "@/Graphql/mutations";
import { RootState } from "@/Redux/reducer";

const OperatorTable = ({
  id,
}: {
  operators?: any[];
  id: string | string[] | undefined | {};
}) => {
  const [showMyModal, setShowMyModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [operatorList, setOperatorList] = useState<any>([]);
  const [changeRole, setChangeRole] = useState("");
  const [MakeAdmin, {}] = useMutation(MAKE_ADMIN);
  const [CreateOperator, {}] = useMutation(CREATE_OPERATOR);
  const [DeleteOperator, {}] = useMutation(DELETE_OPERATOR);
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>("");
  const [selectedOperatorName, setSelectedOperatorName] = useState<string>("");

  const [info, setInfo] = useState({
    name: "",
    senderName: "",
    phoneNumber: "",
  });

  const [operator, setOperator] = useState({
    activationCode: "",
    name: "",
    phoneNumber: "",
    role: "",
    departmentId: "",
  });

  const router = useRouter();
  const dispatch = useDispatch();

  const handleDetailsClick = (operator: any, operatorId: string) => {
    dispatch(setOperatorDetails(operator));
    dispatch(setOperatorId(operatorId));
    router.push(`/operator/${operator.id}`);
  };
  const operatorId = useSelector(
    (state: RootState) => state.operator.operatorId
  );
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const newOperator = await CreateOperator({
        variables: {
          newOperatorArgs: {
            activationCode: operator.activationCode,
            departmentId: operator.departmentId,
            name: operator.name,
            phoneNumber: operator.phoneNumber,
            role: "staff",
          },
        },
      });

      if (newOperator.data && newOperator.data.CREATE_OPERATOR) {
        setOperator(newOperator.data);
      }
      setIsLoading(false);
      closeTheModal();
      reloadOperators();
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSubmit;
  }, [operator]);

  const { data, refetch: reloadOperators } = useQuery(GET_OPERATORS_LIST, {
    variables: { organizationId: id },
  });
  useEffect(() => {
    setOperatorList(data);
  }, [data]);

  const { data: data1 } = useQuery(GET_DEPARTMENT_LIST, {
    variables: { organizationId: id },
  });
  useEffect(() => {
    if (data1 && data1.departmentsList) {
      setDepartments(data1.departmentsList);
    }
  }, [data1]);

  const handleRoleChange = async (event: any) => {
    try {
      const newRole = await MakeAdmin({
        variables: {
          operatorId: operatorId,
        },
      });

      if (newRole.data && newRole.data.MAKE_ADMIN) {
        setChangeRole(newRole.data);
        console.log("role,", changeRole);
      }
    } catch (error) {}
  };

  const handleDeleteRow = async (id: string) => {
    try {
      const deleteOperator = await DeleteOperator({
        variables: {
          operatorId: id,
        },
      });
      reloadOperators();
    } catch (error) {}
  };
  const handleChange = (event: any) => {
    setOperator({
      ...operator,
      [event.target.name]: event.target.value,
    });
  };

  const closeTheModal = () => {
    setShowMyModal(false);
  };
  return (
    <>
      <div id="container" className="mt-12">
        <div className="flex items-center justify-between">
          <h1 className="font-medium">Operators</h1>
          <div className="bg-teal-50 rounded-lg p-2 flex items-center">
            <AddUser set="curved" primaryColor="blue" size={16} />
            <button
              onClick={() => {
                setShowMyModal(true);
              }}
              className="text-indigo-600 text-sm ml-2"
            >
              Add Operator
            </button>
          </div>
        </div>
      </div>

      <div className="mt-1 border rounded-t-lg overflow-hidden max-sm:overflow-x-auto w-full">
        <table className=" border-gray-300 p-1 min-w-full max-sm:overflow-auto">
          <thead className="bg-gray-100 border-b-2 text-sm max-sm:text-xs">
            <tr className="">
              <th className="px-4 py-4 text-left text-sm font-bold ">
                <div className="flex items-center">
                  <div className="mr-2"></div>
                  <div className="truncate">#</div>
                </div>
              </th>
              <th className="px-4 py-2 text-left text-sm font-bold ">
                <div className="flex items-center">
                  <div className="mr-2"></div>
                  <div className="truncate">Operator Name</div>
                </div>
              </th>
              <th className="px-4 py-2 text-left text-sm font-bold ">
                <div className="flex items-center">
                  <div className="mr-2">
                    <Call set="curved" primaryColor="black" size={18} />
                  </div>
                  <div className="truncate">Phone Number</div>
                </div>
              </th>
              <th className="px-4 py-2 text-left text-sm font-bold ">
                <div className="flex items-center">
                  <div className="mr-2">
                    {" "}
                    <Message set="curved" primaryColor="black" size={18} />
                  </div>
                  <div className="truncate">Department</div>
                </div>
              </th>
              <th className="px-4 py-2 text-left text-sm font-bold ">
                <div className="flex items-center">
                  <div className="mr-2">
                    <TimeCircle set="curved" primaryColor="black" size={18} />
                  </div>
                  <div className="truncate">Last Text Message</div>
                </div>
              </th>
              <th className="px-4 py-4 text-left text-sm font-bold "></th>
              <th className="px-4 py-4 text-left text-sm font-bold "></th>
            </tr>
          </thead>
          <tbody className="text-center bg-white m-0  text-neutral-800 text-sm max-sm:text-xs ">
            {data && data.operatorsList.length > 0 ? (
              data.operatorsList.map((item: any, index: number) => (
                <tr className="" key={item.id}>
                  <td className="px-4 py-2 text-center text-sm">{index + 1}</td>
                  <td className="px-4 py-2 text-center text-sm">{item.name}</td>
                  <td className="px-4 py-2 text-center text-sm">
                    {item.phoneNumber}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-black font-medium">
                    {item.departments
                      ? item.departments.map((depItem: any) => depItem.name)
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-center text-sm">
                    {new Date().toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-center text-sm">
                    <button
                      className="max-sm:pl-2 max-sm:text-xs text-indigo-600 text-sm inline-block"
                      onClick={() => {
                        handleDetailsClick(item, item.id);
                      }}
                    >
                      Details
                    </button>
                  </td>
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
                  No operators found.
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
                  {selectedOperatorName} Operator?
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
                  handleDeleteRow(selectedOperatorId);
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
          <form className="p-4 m-4" onSubmit={handleSubmit}>
            <h1 className="text-xl font-medium mb-7 max-sm:text-center max-sm:text-lg">
              Add Operator To Your Organization
            </h1>
            <div className="flex justify-between items-center max-sm:flex-col">
              <div className="w-1/2 pr-2 max-sm:w-full">
                <label className="block pd-3 mb-1 text-sm">
                  Enter the name of your operator
                </label>
                <input
                  name="name"
                  type="text"
                  value={operator.name}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  placeholder="What is the name your operator?"
                  className="w-full p-3 rounded-lg border text-sm border-gray-200 outline-none"
                />
              </div>
              <div className="w-1/2 pl-5 max-sm:pl-0 max-sm:w-full max-sm:pt-3">
                <label className="block pd-3 mb-1 text-sm">
                  Choose the Department
                </label>
                <input
                  list="departments"
                  name="departmentId"
                  value={operator.departmentId}
                  onChange={handleChange}
                  placeholder="Default Department-DEFAULT?"
                  className="w-full bg-gray-50 p-3 outline-none text-gray-600 text-sm rounded-lg border border-gray-200 mr-2"
                />
                <datalist id="departments">
                  {departments &&
                    departments.length &&
                    departments.map((data: any) => (
                      <option value={data.id} key={data.id}>
                        {data.name}
                      </option>
                    ))}
                </datalist>
              </div>
            </div>

            <label className="block mt-6 text-gray-400 text-lg mb-7">
              Activate Operator Account
            </label>

            <div className="flex justify-between items-center mb-14 max-sm:mb-2 max-sm:flex-col">
              <div className="w-1/2 pr-2 max-sm:w-full">
                <label className="block pd-3 mb-1 text-sm">
                  Select Operator Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={operator.phoneNumber}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  placeholder="Enter Phone Number"
                  className="w-full p-3 mr-5 outline-none text-sm rounded-lg border border-gray-200"
                />
              </div>

              <div className="w-1/2 pr-2 max-sm:w-full mt-2">
                <label className="block pd-3 mb-1 text-sm">
                  Change Operator Role
                </label>
                <select
                  name="role"
                  autoComplete="off"
                  className="w-full p-3 mr-5 outline-none text-sm rounded-lg border border-gray-200"
                >
                  <option value="">Choose Role</option>
                  <option value={operator.role} onChange={handleRoleChange}>Admin</option>
                </select>
              </div>

              <div className="w-1/2 pl-5 max-sm:w-full max-sm:pl-0 max-sm:pt-3">
                <label className="block pd-3 mb-1 text-sm">
                  Verification Code
                </label>
                <input
                  name="activationCode"
                  value={operator.activationCode}
                  onChange={handleChange}
                  maxLength={4}
                  type="text"
                  placeholder="4 Digit Verification Code"
                  autoComplete="off"
                  required
                  className="w-2/3 p-3 outline-none text-sm rounded-lg border border-gray-200 mr-2"
                />
              </div>
            </div>

            <div className="mt-8 max-sm:mt-0 border-t-2 border-gray-200 pt-7 flex gap-12 max-sm:gap-8">
              <button
                className="py-3 px-5 text-sm font-medium rounded-lg text-white bg-indigo-600 max-sm:py-2 w-1/4 h-12 max-sm:text-start max-sm:w-full max-sm:text-xs max-sm:px-3"
                type="submit"
              >
                {" "}
                {isLoading ? (
                  <div>
                    Saving
                    <embed
                      src="/loader.svg"
                      className="animate-spin ease-in-out inline-block ml-4 "
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
                onClick={() =>
                  setInfo({ name: "", senderName: "", phoneNumber: "" })
                }
              >
                Discard Changes
              </button>
            </div>
          </form>
        </MyModal>
      </div>
    </>
  );
};
export default OperatorTable;
