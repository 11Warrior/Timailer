// import React, { createContext, ReactNode, useEffect, useState } from 'react'
// import axios from 'axios'

// export type FrontendAuthResponse = {
//     id: string,
//     name: string,
//     email: string,
//     image: string,
// }

// export const UserContextProvider = createContext<FrontendAuthResponse | undefined>(undefined);

// const UserContext = ({ children } : {children : ReactNode} ) => {

//     const backendURL = import.meta.env.VITE_BACKEND_URL ;

//     const [data, setdata] = useState<FrontendAuthResponse>();

//     useEffect(() => {
//         try {
//             axios.get(`${backendURL}/timailer/auth/getMe`, {
//                 withCredentials: true,
//             }).then(res => {
//                 setdata(res.data);
//                 // return res;
//             }).catch((error) => {
//                 console.log("Error while getting auth user from backend.", error);
//             })
//         } catch (error) {
//             console.log("Error getting auth user", error)
//         }
//     }, [])

//     return (
//         <UserContextProvider.Provider value={{data, setdata}}>
//             {children}
//         </UserContextProvider.Provider>
//     )
// }

// export default UserContext