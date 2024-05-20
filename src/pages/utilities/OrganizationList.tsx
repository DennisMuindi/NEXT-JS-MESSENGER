import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Delete, Message } from "react-iconly";
import OrgHeader from "./OrgHeader";
import { useDispatch } from "react-redux";
import { setOrganizationId } from "@/Redux/organizationSlice";

export default function OrganizationList({ tableData }: { tableData?: any[] }) {
  const [data, setData] = useState(tableData || []);
  const [searchItem, setSearchItem] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filteredData, setFilteredData] = useState(data);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    setData(tableData || []);
    setCurrentPage(1)
  }, []);

  const handleDetailsClick = (id: string) => {
    dispatch(setOrganizationId(id));
    router.push(`/organization/${id}`);
  };

  const handleSearch = (e: any) => {
    const searchQuery = e.target.value.toLowerCase();
    setSearchItem(searchQuery);

    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery)
    );
    setFilteredData(filteredData);
  };


  const handleDeleteRow = async (id: string) => {
    if (!data?.length) return;
    const updatedRows = data.filter((data) => data.id !== id);
    setData(updatedRows);
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
                      <Message set="curved" primaryColor="black" size={20} />
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
                data.slice(startIndex, endIndex).map((data, info) => (
                  <tr
                    className="border-b border-gray-200 hover:bg-gray-100"
                    key={data.id}
                  >
                    <td className="p-4 text-left max-sm:p-2">{info + 1}</td>
                    <td className="p-4 text-left max-sm:p-2">{data.name}</td>
                    <td className="p-4 text-left max-sm:p-2">
                      {data.operators}
                    </td>
                    <td className="p-4 text-left max-sm:p-2">
                      {data.smsBalance}
                    </td>

                    <td className="p-4 text-left max-sm:p-2 flex items-center gap-2">
                      <button
                        className="mr-10 text-indigo-600 text-sm font-medium max-sm:text-xs"
                        onClick={() => {
                          handleDetailsClick(data.id);
                        }}
                      >
                        Details
                      </button>
                      <button
                        className=" max-sm:mr-0 text-red-600"
                        onClick={() => handleDeleteRow(data.id)}
                      >
                        <Delete set="curved" primaryColor="red" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="bg-gray-300 p-3 flex items-center justify-end gap-20 max-sm:bg-gray-300 max-sm:justify-between max-sm:gap-10">
            <button className="bg-indigo-600 py-2 px-4 text-white rounded" onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>{currentPage}</span>
            <button className="bg-pink-600 py-2 px-4 text-white rounded"
              onClick={handleNextPage}
              // disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
