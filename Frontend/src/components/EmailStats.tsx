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
                    <div className="flex">
                        <span className="text-sm font-medium text-gray-900 pr-40">
                            To: {email.receiverEmail[0]}
                        </span>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-medium">
                                {email.status === "Scheduled" ? (
                                    <>
                                        <ClockIcon /> {new Date(email.scheduledAt).toDateString() + " " + formatEmailTime(new Date(email.scheduledAt).toISOString())}
                                    </>
                                )
                                    :
                                    "Sent"
                                }
                            </span>

                            <span className="font-medium text-gray-800">
                                {email.subject}
                            </span>

                            <span className="text-gray-400 truncate max-w-md">
                                - {email.body}
                            </span>
                        </div>
                    </div>


                    {/* Right: Star */}
                    < button className="text-gray-300 hover:text-yellow-400" >
                        <StarIcon />
                    </button>
                </div>
            ))
            }
        </div >
    );
}
