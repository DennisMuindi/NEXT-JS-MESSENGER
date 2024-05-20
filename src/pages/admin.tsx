import Notification from "public/Notification";
import ArrowDownUp from "./utilities/ArrowDownUp";
import OrgHeader from "./utilities/OrgHeader";
import { GET_OPERATORS_LIST, GET_ORGANIZATIONS_LIST } from "../Graphql/queries";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Delete, Message } from "react-iconly";
import { useDispatch } from "react-redux";
import { setOrganizationId } from "@/Redux/organizationSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/reducer";

const Admin = () => {
  const [tableData, setTableData] = useState<any>([]);
  const [searchItem, setSearchItem] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [operatorList, setOperatorList] = useState<any>([]);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, tableData.length);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const id = useSelector((state: RootState) => state.organization.id);

  const { data } = useQuery(GET_ORGANIZATIONS_LIST);
  useEffect(() => {
    setTableData(data);
  }, [data]);

  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    setTableData(tableData || []);
    setCurrentPage(1);
  }, []);

  const handleDetailsClick = (id: string) => {
    dispatch(setOrganizationId(id));
    router.push(`/organization/${id}`);
  };

  const handleSearch = (e: any) => {
    const searchItem = e.target.value.toLowerCase();
    setSearchItem(searchItem);

    const filteredData = data.filter((item: any) =>
      item.name.toLowerCase().includes(searchItem)
    );
    setTableData(filteredData);
  };

  const handleDeleteRow = async (id: string) => {
    if (!data?.length) return;
    const updatedRows = data.filter((data: any) => data.id !== id);
    setTableData(updatedRows);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <div className="flex bg-gray-50 w-full">
        {/* Inner Container */}
        <div className="my-8 mx-auto w-4/5 space-x-4">
          {/* Top Nav */}
          <div className="flex items-center justify-between max-sm:gap-16">
            <div className="">
              <embed
                className="w-24 h-20 max-sm:w-16"
                src="/Vector.svg"
                type=""
              />
            </div>
            <div className="flex items-center justify-between gap-10 max-sm:gap-5 max-sm:items-center">
              <Message set="curved" primaryColor="black" size={20} />
              <Notification />
              <h2 className="rounded-lg bg-indigo-600 p-1 text-white text-xs font-medium">
                SB
              </h2>
              <ArrowDownUp />
            </div>
          </div>

          {/* Overview Div */}
          <div className="flex items-center gap-11 mt-4 max-sm:w-full">
            <button className="bg-indigo-600 text-white py-2 px-5 max-sm:px-2 rounded-3xl">
              Overview
            </button>
            <a className="text-gray-500 text-sm" href="">
              Cloud
            </a>
            <a className="text-gray-500 text-sm" href="">
              Settings
            </a>
          </div>

          <div>
            <OrgHeader value={searchItem} handleSearch={handleSearch} />
            <div className="table-container">
              <div className="mt-10 border rounded-t-lg overflow-hidden max-sm:overflow-auto">
                <table className="border-gray-300 p-1 min-w-full">
                  <thead className="bg-gray-100 border-b-2 text-sm">
                    <tr className="border-b border-gray-200">
                      <th className="p-4 text-left text-sm font-bold">
                        <div className="flex items-center">
                          <div className="mr-2"></div>
                          <div className="truncate">#</div>
                        </div>
                      </th>
                      <th className="p-4 text-left text-sm font-bold ">
                        <div className="flex items-center">
                          <div className="mr-2"></div>
                          <div className="truncate">Organization</div>
                        </div>
                      </th>

                      <th className="p-4 text-left text-sm font-bold ">
                        <div className="flex items-center">
                          <div className="mr-2">
                            <embed src="/User.svg" />
                          </div>
                          <div className="truncate">Operators</div>
                        </div>
                      </th>

                      <th className="p-4 text-left text-sm font-bold ">
                        <div className="flex items-center">
                          <div className="mr-2">
                            <Message
                              set="curved"
                              primaryColor="black"
                              size={20}
                            />
                          </div>
                          <div className="truncate">SMS Balance</div>
                        </div>
                      </th>
                      <th className="p-4 text-left text-sm font-bold ">
                        <div className="">
                          <div className="mr-2"></div>
                          <div className="truncate">Actions</div>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-center bg-white m-0  text-neutral-800 max-sm:text-xs text-sm ">
                    {data &&
                      data.organizationsList.slice(startIndex, endIndex) &&
                      data.organizationsList.map((item: any, info: number) => (
                        <tr
                          className="border-b border-gray-200 hover:bg-gray-100"
                          key={item.id}
                        >
                          <td className="p-4 text-left max-sm:p-2">
                            {info + 1}
                          </td>
                          <td className="p-4 text-left max-sm:p-2">
                            {item.name}
                          </td>
                          <td className="p-4 text-left max-sm:p-2">
                          {item.operators
                              ? item.operators.length
                              : "-"}
                          </td>
                          <td className="p-4 text-left max-sm:p-2">
                            {item.departments
                              ? item.departments.map(
                                  (depItem: any) => depItem.smsBalance
                                )
                              : "-"}
                          </td>

                          <td className="p-4 text-left max-sm:p-2 flex items-center gap-2">
                            <button
                              className="mr-10 text-indigo-600 text-sm font-medium max-sm:text-xs"
                              onClick={() => {
                                handleDetailsClick(item.id);
                              }}
                            >
                              Details
                            </button>
                            <button
                              className=" max-sm:mr-0 text-red-600"
                              onClick={() => handleDeleteRow(item.id)}
                            >
                              <Delete set="curved" primaryColor="red" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="bg-gray-300 p-3 flex items-center justify-end gap-20 max-sm:bg-gray-300 max-sm:justify-between max-sm:gap-10">
                  <button
                    className="bg-indigo-600 py-2 px-4 text-white rounded"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span>{currentPage}</span>
                  <button
                    className="bg-pink-600 py-2 px-4 text-white rounded"
                    onClick={handleNextPage}
                    // disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
