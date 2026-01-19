import EmailStats from "@/components/EmailStats";
import LoadingUI from "@/components/LoadingUI";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar"
import { backendURL } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";

export type FrontendAuthResponse = {
  id: string,
  name: string,
  email: string,
  image: string,
}


export type EmailProp = {
  attachmentImage: string,
  body: string
  id: string
  receiverEmail: string[]
  scheduledAt: string
  senderEmail: string
  status: string
  subject: string
}

export type EmailResponse = {
  emails: EmailProp,
  scheduledEmails: number,
  sentEmails: number;
}


const Dashboard = () => {
  const [data, setdata] = useState<FrontendAuthResponse>();
  const [emails, setEmails] = useState<EmailResponse>();

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

      axios.get(`${backendURL}/timailer/getEmails/${data?.id}`, {
        withCredentials: true,
      }).then(res => {
        setEmails(res.data);
      }).catch((error) => {
        console.log("Error while getting emails from backend to frontend", error)
      })

    } catch (error) {
      console.log("Error getting auth user", error)
    }
  }, [data?.id])

  // console.log(data)
  console.log(emails, typeof(emails))
  if (!data || !emails) return <LoadingUI />

  return (
    <div className="w-screen h-screen">
      <Navbar />
      <div className="flex gap-10  w-screen h-screen">
        <Sidebar userData={data} emails={emails}/>
        <div className="w-full">

          <EmailStats emails={emails?.emails} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard