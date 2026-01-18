import { ArrowLeft, Clock, Paperclip, Upload } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { Separator } from "@/components/ui/separator";
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    LinkIcon,
    Undo,
    Redo,
} from "lucide-react";
import { useState } from 'react';
import { parseEmails } from '@/lib/utils';

type BodyDataType = {
    senderEmail: string,
    receiverEmail: string[],
    subject: string,
    body: string
}


const ComposeNewEmail = () => {
    const [bodyData, setbodyData] = useState<BodyDataType>({
        senderEmail: " ",
        receiverEmail: [""],
        subject: "",
        body: ""
    });
    // const [receiverEmails, setReceiverEmails] = useState<string[]>();

    const handleSend = () => {
        //sending logic calling backend scheduling things
        console.log(bodyData);
    }

    const handleFileUpload = (file: File) => {
        const reader = new FileReader();

        reader.onload = e => {
            console.log(e.target);
            const content = e.target?.result as string;
            const parsedEmailList = parseEmails(content);
            console.log(parsedEmailList);
            // setReceiverEmails(parsedEmailList);
            setbodyData({ ...bodyData, receiverEmail: parsedEmailList })
        }

        reader.onloadstart = e => {
            return <p>Loading</p>
        }

        reader.onerror = e => {
            console.log("Error is: ", e.target?.error);
        }

        reader.readAsText(file);
    }

    const location = useLocation();
    const senderEmail = location.state;
    // console.log(senderEmail)

    return (
        <section className='w-full h-screen'>
            <div className='w-full h-[6vw] p-4  flex items-center justify-between'>
                <div className='flex gap-2 text-2xl items-center'>
                    <Link to={'/dashboard'}>
                        <ArrowLeft />
                    </Link>
                    <h2>Compose New Email</h2>
                </div>

                <div className="flex items-center gap-4">
                    <input className='hidden' type="file" id='upload-attachment' />

                    <label htmlFor="upload-attachment">
                        <Paperclip width={20} className=" bg-amber-50 text-muted-foreground cursor-pointer" />
                    </label>

                    <Clock width={20} className="text-muted-foreground cursor-pointer" />
                    <button className="rounded-full px-8 py-1 bg-white border border-green-600 text-green-600 hover:bg-green-600 hover:text-white cursor-pointer duration-200 ease" onClick={() => handleSend()}>
                        Send
                    </button>
                </div>
            </div>

            <div className="space-y-4 px-50 py-4">
                {/* From */}
                <div className="grid grid-cols-[80px_1fr] items-center gap-3">
                    <label>From</label>
                    <select defaultValue="oliver" className='px-3 py-2 bg-gray-200 rounded-lg w-fit active:outline-1 active:outline-green-600' >
                        <option className='' onClick={() => setbodyData({ ...bodyData, senderEmail })}>{senderEmail}</option>
                    </select>
                </div>


                <div className="grid grid-cols-[80px_1fr] items-center gap-3">
                    <label>To</label>
                    <span className='flex justify-between px-3 py-2 outline-none border-b  border-b-gray-300/50'>
                        <div className='flex gap-2 items-center'>
                            {bodyData?.receiverEmail?.length > 1 && bodyData?.receiverEmail.slice(0, 3).map((emailId, index) => (
                                <div key={index} className='rounded-lg outline-2 outline-green-600 px-3 py-1 bg-green-100'>{emailId}</div>
                            ))}

                            {bodyData?.receiverEmail?.length > 3 && (
                                <div className='rounded-full flex items-center object-center outline-2 p-1 outline-green-600  bg-green-100'>
                                    +{bodyData?.receiverEmail?.length - 3}
                                </div>
                            )}

                        </div>
                        <div className='flex gap-2 items-center text-green-600'>

                            <input className='hidden' id='email-files' type='file' accept='.txt, .csv' onChange={(e) => {
                                e.target?.files?.[0] && handleFileUpload(e.target?.files?.[0])
                            }} />
                            <label htmlFor='email-files' className='cursor-pointer flex gap-2 items-center'>
                                <Upload size={17} />
                                Upload File
                            </label>

                        </div>
                    </span>
                </div>


                <div className="grid grid-cols-[80px_1fr] items-center gap-3">
                    <label>Subject</label>
                    <input value={bodyData.subject} onChange={(e) => setbodyData({ ...bodyData, subject: e.target.value })} placeholder="Subject" className='px-3 py-2 outline-none border-b border-b-gray-300/50' />
                </div>

                <div className="flex items-center gap-6 ">
                    <div className="flex items-center gap-2">
                        <label>
                            Delay between 2 emails
                        </label>
                        <input type='number' className="w-16 px-3 py-2 outline rounded-lg" placeholder="00" />
                    </div>

                    <div className="flex items-center gap-2">
                        <label>
                            Hourly Limit
                        </label>
                        <input type='number' className="w-16  px-3 py-2 outline rounded-lg" placeholder="00" />
                    </div>
                </div>


                <div className="rounded-md border bg-muted/30">

                    <div className="flex items-center bg-white gap-3 px-3 py-2 text-muted-foreground rounded-lg">
                        <Undo size={16} />
                        <Redo size={16} />
                        <Separator orientation="vertical" className="h-4" />
                        <Bold size={16} />
                        <Italic size={16} />
                        <Underline size={16} />
                        <Separator orientation="vertical" className="h-4" />
                        <List size={16} />
                        <ListOrdered size={16} />
                        <LinkIcon size={16} />
                    </div>

                    <textarea
                        value={bodyData.body}
                        onChange={(e) => setbodyData({ ...bodyData, body: e.target.value })}
                        placeholder="Type Your Reply..."
                        className="min-h-65 w-full resize-none bg-transparent p-4 outline-none"
                    />
                </div>

            </div>
        </section>
    )
}

export default ComposeNewEmail