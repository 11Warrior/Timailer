import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { EmailProp, FrontendAuthResponse } from "@/Pages/Dashboard";
import { Mail, Clock, ArrowDownIcon, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({ userData, emails }: { userData: FrontendAuthResponse }) {
  const navigate = useNavigate();
  // console.log(emails)
  return (
    <div className="flex h-full flex-col pb-4 ">
      <div className="flex items-center justify-between mb-6  bg-[#F4F7F5] p-3 rounded-2xl">
        <div className="flex items-center  gap-3 ">
          <Avatar>
            <AvatarImage src={userData?.image} />
          </Avatar>
          <div>
            <p className="text-sm font-medium">{userData?.name}</p>
            <p className="text-xs text-muted-foreground">
              {userData?.email}
            </p>
          </div>
        </div>

        <div className="cursor-pointer">
          <ChevronDown />
        </div>

      </div>

      <Button className="mb-6 rounded-full bg-white text-green-600 border border-green-600 hover:bg-green-600 hover:text-white cursor-pointer" onClick={() => navigate('/dashboard/send-email', {
        state: {
          senderEmail: userData.email,
          userId: userData.id
        }
      })}>
        Compose
      </Button>


      <nav className="space-y-1">
        <NavItem icon={Clock} label="Scheduled" count={emails.scheduledEmails} active />
        <NavItem icon={Mail} label="Sent" count={emails.sentEmails} />
      </nav>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  count,
  active,
}: any) {
  return (
    <div
      className={`flex items-center justify-between rounded-md px-3 py-2 text-sm cursor-pointer ${active ? "bg-green-50 text-green-600" : "hover:bg-muted"
        }`}
    >
      <div className="flex items-center gap-2">
        <Icon size={16} />
        {label}
      </div>
      <span className="text-xs text-muted-foreground">{count}</span>
    </div>
  );
}
