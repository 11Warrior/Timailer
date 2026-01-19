import { formatEmailTime } from "@/lib/utils";
import type { EmailProp } from "@/Pages/Dashboard";
import { Badge, ClockIcon, Star, StarIcon } from "lucide-react";

export default function EmailStats({ emails }: { emails: EmailProp[] }) {
    // emails.map((email) => (console.log(email)))
    // console.log(emails)
    return (
        <div className="max-w-full h-screen">
            {emails?.map((email) => (
                <div key={email.id} className="flex items-center justify-between px-7 py-2  border-b border-gray-200">
                    <div className="flex ">
                        <span className="text-sm  font-medium text-gray-900  w-120 truncate">
                            To: {email.receiverEmail[0]}
                        </span>

                        <div className="flex flex-1 items-center   gap-2 text-sm text-gray-600">
                            <span className={`flex   items-center gap-1 px-2 py-0.5 rounded-full  text-xs font-medium whitespace-nowrap ${email.status === "Scheduled" ? 'bg-orange-100 text-orange-600' : 'text-black bg-gray-100 border border-gray-200'}`}>
                                {email.status === "Scheduled" ? (
                                    <>
                                        <ClockIcon /> {new Date(email.scheduledAt).toDateString() + " " + formatEmailTime(new Date(email.scheduledAt).toISOString())}
                                    </>
                                )
                                    :
                                    "Sent"
                                }
                            </span>

                            <span className="font-medium   text-gray-800 truncate">
                                {email.subject}
                            </span>

                            <span className="text-gray-400  max-w-md truncate">
                                - {email.body}
                            </span>
                        </div>
                    </div>


                    < button className="text-gray-300   hover:text-yellow-400" >
                        <StarIcon />
                    </button>
                </div>
            ))
            }

            {emails?.length == 0 && (
                <div className="flex items-center justify-center">
                    No Emails Sent / Scheduled
                </div>
            )}
        </div >
    );
}
