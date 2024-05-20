import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function RedirectingLoader() {
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setTimeout(()=>{
      if(token){
        const parts = token.split(".");
        const payload = parts[1];
        const decodedPayload = atob(payload);
        const jsonPayload = JSON.parse(decodedPayload);
        const role = jsonPayload.r;
        
        if(role === "staff"){
          router.push("https://sms.artemisys.tech/sign-in")
        }
        else if(role === "superadmin"){
          router.push("/admin")
        }
        else if(role=== "admin"){
          router.push(`/organization/${jsonPayload.o}`)
        }
    
        }
          setRedirect(true); 

    }, 3000)
     
  }, []);

  if (!redirect) {
    return (
      <div className='flex items-center justify-center rounded-lg bg-indigo-400 gap-4 w-3/4 h-12 p-5 mx-auto'>
        <embed className='animate-spin text-white' src="/loader.svg" type="" />
        <p className='text-white text-sm'>Redirecting. Please wait</p>
      </div>
    );
  }

  return null;
}
