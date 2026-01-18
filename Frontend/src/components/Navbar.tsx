import { RefreshCw, Search, SlidersHorizontal } from "lucide-react"
import { Input } from "./ui/input"

const Navbar = () => {
    return (
        <nav className=' w-full gap-3  p-4 flex justify-between'>
            <div className="bg-amber-200 w-[18vw]">
                <div className="w-[4vw]">
                    <img src="/logo.png" alt="" className="w-full h-full" />
                </div>
            </div>

            <div className="flex gap-2 items-center  w-full">

                <div className="pl-9 flex gap-1 items-center rounded-full bg-muted w-full">
                    <Search className="  h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search"
                        className="outline-none border-none bg-none h-full"
                    />

                </div>
                <SlidersHorizontal className="cursor-pointer text-muted-foreground" />
                <RefreshCw className="cursor-pointer text-muted-foreground" />

            </div>
        </nav>
    )
}

export default Navbar