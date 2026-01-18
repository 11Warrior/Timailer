import { Badge, Star } from "lucide-react";
import { useEffect, useState } from "react";

const emails = [
    {
        to: "John Smith",
        subject: "Meeting follow-up",
        preview: "Hi John, just wanted to follow up on our meeting...",
        time: "Tue 9:15:12 AM",
        status: "Scheduled",
    },
    {
        to: "Olive",
        subject: "Ramit, great to meet you",
        preview: "Hi Olive, just wanted to follow up on our meeting...",
        time: "Thu 8:15:12 PM",
        status: "Scheduled",
    },
];


export default function EmailStats() {
    const [emailData, setEmailData] = useState();

    // useEffect(() => {

    // }, [])
    return (
        <div className="w-full h-screen">
            {emails.map((email, idx) => (
                <div key={idx} className="w-full flex items-center justify-between px-6 py-4 border-b hover:bg-muted/40 cursor-pointer">
                    <div className="flex items-center gap-4">
                        <Badge
                            className="rounded-full bg-orange-100 text-orange-600"
                        >
                            {email.time}
                        </Badge>

                        <div>
                            <p className="text-sm">
                                <span className="font-medium">To:</span> {email.to}
                            </p>
                            <p className="text-sm font-medium">{email.subject}</p>
                            <p className="text-xs text-muted-foreground">{email.preview}</p>
                        </div>
                    </div>

                    <Star className="text-muted-foreground hover:text-yellow-400" size={18} />
                </div>
            ))}
        </div>
    );
}
