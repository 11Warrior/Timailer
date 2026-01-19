import { Funnel, RefreshCw, RotateCw, Search, SlidersHorizontal } from "lucide-react"
import { Input } from "./ui/input"

const Navbar = () => {
    return (
        <nav className=' w-full gap-3  p-4 flex justify-between'>
            <div className=" w-[18vw]">
                <div className="w-[4vw]">
                    <img src="/logo.png" alt="" className="w-full h-full" />
                </div>
            </div>

            <div className="flex gap-2 items-center  w-full">

                <div className="pl-9 py-2 flex gap-1 items-center rounded-full  w-[60%]">
                    <Search className="  h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search"
                        className="outline-none border-none rounded-full bg-muted px-3 py-2 h-full"
                    />

                </div>
                <Funnel className="cursor-pointer text-muted-foreground" />
                <RotateCw className="cursor-pointer text-muted-foreground" />

            </div>
        </nav>
    )
}

export default Navbar