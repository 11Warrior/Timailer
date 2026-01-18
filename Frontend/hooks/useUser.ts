// import { useEffect, useState } from "react";
// import axios from 'axios'

// export type FrontendAuthResponse = {
//     id: string,
//     name: string,
//     email: string,
//     image: string,
// }


// const [data, setdata] = useState<FrontendAuthResponse>();
// const backendURL = import.meta.env.VITE_BACKEND_URL!

// useEffect(() => {
//     try {
//         axios.get(`${backendURL}/timailer/auth/getMe`, {
//             withCredentials: true,
//         }).then(res => {
//             setdata(res.data);
//             // return res;
//         }).catch((error) => {
//             console.log("Error while getting auth user from backend.", error);
//         })
//     } catch (error) {
//         console.log("Error getting auth user", error)
//     }
// }, [])

// console.log(data)