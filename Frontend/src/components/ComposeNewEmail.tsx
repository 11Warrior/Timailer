import { ArrowLeft, CalendarIcon, Clock, Paperclip, Upload } from 'lucide-react'
import { Link, Navigate, redirect, useLocation, useNavigate } from 'react-router-dom'

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

import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { backendURL,  parseEmails } from '@/lib/utils';
import { Dialog, DialogContent, DialogFooter } from './ui/dialog';
import { DialogClose, DialogTrigger } from '@radix-ui/react-dialog';
import { Calendar } from './ui/calendar';
import { Popover, PopoverTrigger } from './ui/popover';
import { PopoverContent } from '@radix-ui/react-popover';
import { Input } from './ui/input';
import axios from 'axios';


type BodyDataType = {
    senderEmail: string,
    receiverEmail: string[],
    subject: string,
    attachmentImage: string,
    body: string
}

type DateAndTimeType = {
    date: Date,
    time: string
}


const ComposeNewEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const senderEmail = location.state.senderEmail;
    const userId = location.state.userId;
    // console.log(senderEmail)
    // console.log(userId);

    const [bodyData, setbodyData] = useState<BodyDataType>({
        senderEmail: senderEmail,
        receiverEmail: [""],
        subject: "",
        attachmentImage: "",
        body: ""
    });

    const [dateAndTime, setDateAndTime] = useState<DateAndTimeType>({
        date: new Date(),
        time: "10:00:00"
    })

    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

    const handleSend = (e: Event) => {
        //sending logic calling backend scheduling things // console.log(senderEmail)
        const date = dateAndTime.date;
        const time = dateAndTime.time;

        const [hh, mm, ss] = time.split(":");

        date.setHours(
            Number(hh),
            Number(mm),
            Number(ss)
        )

        console.log(new Date(date).toISOString());

        // setbodyData({ ...bodyData })
        // console.log(bodyData);
        // console.log(dateAndTime.date, dateAndTime.time)
        const payload = {
            ...bodyData,
            userId,
            scheduledAt: new Date(date).toISOString() as string
        }

        // console.log(payload)

        axios({
            url: `${backendURL}/timailer/schedule-email`,
            method: 'post',
            data: payload
        },
        )
            .then(() => {
                console.log("Sucessfully scheduled Email")
            })
            .catch((error) => {
                console.log("Error while calling /schedule-email from Frontend", error);
            })

        setbodyData({
            ...bodyData,
            subject: "",
            attachmentImage: "",
            body: ""
        })
        
        navigate('/dashboard')
        e.preventDefault();
    }

    const handleFileUpload = (file: File) => {
        const reader = new FileReader();

        reader.onload = e => {
            // console.log(e.target);
            const content = e.target?.result as string;
            const parsedEmailList = parseEmails(content);
            // console.log(parsedEmailList);
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


                    <Dialog>
                        <DialogTrigger asChild>
                            <Clock className={`cursor-pointer  ${dateAndTime?.date ? 'text-green-600' : 'text-muted-foreground'}`} />
                        </DialogTrigger>

                        <DialogContent className="w-80 px-3 py-5">
                            <p className="mb-3 text-2xl ">Send Later</p>
                            <div className='flex px-3 py-2 justify-between items-center border-b border-gray-200'>
                                <span>
                                    {dateAndTime?.date.toDateString() + " at " + dateAndTime.time}
                                </span>
                                <Dialog>
                                    <DialogTrigger asChild  >
                                        <CalendarIcon className='cursor-pointer' />
                                    </DialogTrigger>
                                    <DialogContent className='flex flex-col gap-5'>
                                        <div className='flex flex-col'>
                                            <label htmlFor='pick-date'>
                                                Pick Date
                                            </label>
                                            <Popover open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={'default'}
                                                        id='pick-date'
                                                        className='cursor-pointer'
                                                    >
                                                        {dateAndTime?.date ? dateAndTime?.date.toDateString() : "Select Date"}
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent>
                                                    <Calendar
                                                        mode='single'
                                                        selected={dateAndTime?.date}
                                                        buttonVariant={'secondary'}
                                                        onSelect={(date: Date) => {
                                                            setDateAndTime({ ...dateAndTime, date, time: "" });
                                                            setScheduleModalOpen(false);
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div>
                                            <label htmlFor="pick-time" className="px-1">
                                                Time
                                            </label>
                                            <Input
                                                type="time"
                                                id="pick-time"
                                                value={dateAndTime?.time}
                                                onChange={(e) => {
                                                    setDateAndTime({ ...dateAndTime, time: e.target.value })
                                                }}
                                                step="1"
                                                defaultValue="10:30:00"
                                                className="bg-background "
                                            />
                                        </div>

                                        <DialogClose>
                                            <Button variant={'default'} className='cursor-pointer'>
                                                Done
                                            </Button>
                                        </DialogClose>

                                    </DialogContent>
                                </Dialog>
                            </div>

                            <Button variant="ghost" className="w-full justify-start ">
                                Tomorrow, 10:00 AM
                            </Button>

                            <Button variant="ghost" className="w-full justify-start">
                                Tomorrow, 11:00 AM
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                Tomorrow, 3:00 PM
                            </Button>


                            <DialogFooter className="mt-4 flex justify-end gap-2">
                                <DialogClose>
                                    <Button variant="ghost" className='cursor-pointer'>Cancel</Button>
                                </DialogClose>
                                <DialogClose>
                                    <Button className="bg-green-500 hover:bg-green-600 cursor-pointer">
                                        Done
                                    </Button>

                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <button className="rounded-full px-8 py-1 bg-white border border-green-600 text-green-600 hover:bg-green-600 hover:text-white cursor-pointer duration-200 ease" onClick={(e) => handleSend(e)}>
                        Send
                    </button>
                </div>
            </div>

            <div className="space-y-4 px-50 py-4">
                {/* From */}
                <div className="grid grid-cols-[80px_1fr] items-center gap-3">
                    <label>From</label>
                    <select onChange={(e) => setbodyData({ ...bodyData, senderEmail: e.target.value })} className='px-3 py-2 bg-gray-200 rounded-lg w-fit active:outline-1 active:outline-green-600' >
                        <option className='' value={senderEmail}>{senderEmail}</option>
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