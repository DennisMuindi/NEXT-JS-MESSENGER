import { useEffect, useState } from "react";
import Search from "./search";
import MyModal from "./MyModal";
import { CREATE_ORGANIZATION } from "@/Graphql/mutations";
import { useMutation } from "@apollo/client";

export default function OrgHeader({
  tableData,
  value,
  handleSearch,
}: {
  tableData?: any[];
  value: any;
  handleSearch: any;
}) {
  const [showMyModal, setShowMyModal] = useState(false);
  const [table, setTable] = useState(tableData);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [CreateOrg, {}] = useMutation(CREATE_ORGANIZATION);
  const [data, setData] = useState({
    name: "",
    senderName: "",
    phoneNumber: ""
  });

  useEffect(() => {
    setTable(table);
  }, [tableData]);

  const handleChange = (event: any) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };
  const closeTheModal = () => {
    setShowMyModal(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const organization = await CreateOrg({
      variables: {
        organization: {
          name: data.name,
          senderName: data.senderName,
          phoneNumber: data.phoneNumber
          
        },
      },
    });
    if(organization.data && organization.data.CREATE_ORGANIZATION){
      console.log("this org", organization.data)
      setTable(organization.data)
    }
    handleSave();
  };

  const handleSave = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setTimeout(() => {
            handleReset();
          });
        }, 2000);
      });
    }, 1000);
  };
  const handleReset = () => {
    setTimeout(() => {
      setData({
        name: "",
        senderName: "",
        phoneNumber: ""
      });
    });
  };

  return (
    <div className="flex justify-between items-center mt-10 max-sm:flex-col max-sm:mt-6">
      <div className="text-2xl font-medium max-sm:text-xl max-sm:w-full">
        <h1>Organizations</h1>
      </div>
      <div className="flex rounded-full relative pl-5 pr-3 items-center justify-between w-1/3 max-sm:w-full m-4 border border-gray-300">
        <input
          type="text"
          placeholder="Search Your Organization"
          value={value}
          onChange={handleSearch}
          className="w-full py-2 focus:outline-none bg-transparent text-gray-600 text-sm"
        />
        <Search />
      </div>

      <div className="max-sm:w-full">
        <button
          className="bg-indigo-600 py-2 px-5 rounded-lg text-white max-sm:w-full max-sm:text-center max-sm:text-sm"
          onClick={() => {
            setShowMyModal(true);
          }}
        >
          Add Organization
        </button>
      </div>
      {/* Modal/Popup */}
      <MyModal visible={showMyModal} closeModal={closeTheModal}>
        <form className="p-4 m-4" onSubmit={handleSubmit}>
          <h1 className="text-xl font-medium mb-7 max-sm:text-center max-sm:text-lg">
            Organization Setup
          </h1>
          <div className="flex justify-between items-center max-sm:flex-col">
            <div className="w-1/2 pr-2 max-sm:pr-0 max-sm:w-full">
              <label className="block pd-3 mb-1 text-sm max-sm:text-xs">
                Enter the Organization Name
              </label>
              <input
                name="name"
                type="text"
                value={data.name}
                onChange={handleChange}
                autoComplete="off"
                required
                placeholder="What is the name the Organization?"
                className="w-full p-3 rounded-lg border text-sm max-sm:text-xs  border-gray-200 outline-none"
              />
            </div>
          </div>

          <label className="block mt-6 text-gray-400 text-lg mb-7 max-sm:mb-5 max-sm:mt-4 max-sm:text-sm max-sm:text-center">
            Create a department for the given organization
          </label>

          <div className="flex justify-between items-center mb-14 max-sm:mb-2 max-sm:flex-col">
            <div className="w-1/2 pr-2 max-sm:pr-0 max-sm:w-full">
              <label className="block pd-3 mb-1 text-sm max-sm:text-xs">
                Department Name
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={data.phoneNumber}
                onChange={handleChange}
                autoComplete="off"
                placeholder="Enter your Phone Number"
                className="w-full p-3 outline-none bg-gray-100 text-sm rounded-lg border border-gray-200 max-sm:text-xs"
              />
            </div>

            <div className="w-1/2 pr-2 max-sm:pr-0 max-sm:w-full ml-8  max-sm:ml-0 mt-2">
              <label className="block pd-3 mb-1 max-sm:text-xs text-sm">
                The Department Sender Name
              </label>
              <input
                type="tel"
                name="senderName"
                value={data.senderName}
                onChange={handleChange}
                autoComplete="off"
                maxLength={11}
                placeholder="Default Department-DEFAULT"
                className="max-sm:text-xs w-5/6 max-sm:w-full p-3 outline-none text-sm rounded-lg border border-gray-200"
              />
            </div>
          </div>

          <div className="mt-8 border-t-2 border-gray-200 pt-7 flex items-center gap-80 max-sm:mt-6 max-sm:gap-8">
            <button
              className="py-3 px-7 w-1/4 h-12 max-sm:h-10 text-sm font-medium rounded-lg text-white bg-indigo-600 max-sm:py-2 max-sm:text-center max-sm:w-full max-sm:text-xs max-sm:px-1"
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
              className="text-sm text-red-500 max-sm:w-full max-sm:text-xs max-sm:py-1 cursor-pointer"
              onClick={handleReset}
            >
              Discard Changes
            </button>
          </div>
          <div className="flex justify-between items-center mt-3 max-sm:flex-col max-sm:mt-6">
            {showAlert && (
              <div className="bg-green-500 w-full text-center text-white px-4 py-2 rounded-md mt-4">
                Saved successfully!
              </div>
            )}
          </div>
        </form>
      </MyModal>
    </div>
  );
}
