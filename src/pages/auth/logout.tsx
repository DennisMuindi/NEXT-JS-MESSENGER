import { useRouter } from "next/router";
import { Magic } from "magic-sdk";

export default function Log_out() {
  const router = useRouter();
    const logout = () => {
      const token = localStorage.removeItem("thisToken");
      const magic = new Magic(`${process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY}`);
      magic.user.logout();
      router.push("/login");
    };
    
  return (
    <div>
      <button className="flex text-center py-2 font-medium px-3 max-sm:text-sm m-2 bg-indigo-600 rounded-lg text-white" onClick={logout}>
        Logout
         {/* <Logout set="bold" primaryColor="gray" /> */}
      </button>
    </div>
  );
}
