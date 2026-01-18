import EmailStats from "@/components/EmailStats";
import LoadingUI from "@/components/LoadingUI";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar"
import axios from "axios";
import { useEffect, useState } from "react";

export type FrontendAuthResponse = {
  id: string,
  name: string,
  email: string,
  image: string,
}

const Dashboard = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL!;
  const [data, setdata] = useState<FrontendAuthResponse>();

  useEffect(() => {
    try {
      axios.get(`${backendURL}/timailer/auth/getMe`, {
        withCredentials: true,
      }).then(res => {
        setdata(res.data);
        // return res;
      }).catch((error) => {
        console.log("Error while getting auth user from backend.", error);
      })
    } catch (error) {
      console.log("Error getting auth user", error)
    }
  }, [])

  console.log(data)
  if (!data) return <LoadingUI />

  return (
    <div className="w-screen h-screen">
      <Navbar />
      <div className="flex gap-10  w-screen h-screen">
        <Sidebar userData={data} />
        <div className="w-full">

          <EmailStats />
        </div>
      </div>
    </div>


  )
}

export default Dashboard