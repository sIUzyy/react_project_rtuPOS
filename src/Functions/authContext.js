
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Database/firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const AuthContext = createContext({
  currentUser: null,
  signIn: () => Promise,
  logOut: () => Promise,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    localStorage.removeItem("user");
    return signOut(auth);
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const value = {
    currentUser,
    signIn,
    logOut,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// // authContext for our Sign in / Sign up / forget & reset Password system.

// import {createContext,
//         useContext,
//         useEffect,
//         useState,
// } from "react";    

// import { auth } from '../Database/firebase'

// import { signInWithEmailAndPassword,
//          onAuthStateChanged,
//          signOut,    
// } from "firebase/auth";
// import Signin from "../Components/Signin";

// const AuthContext = createContext({
// currentUser: null,
// signIn: () => Promise,
// logOut: () => Promise,
// })

// export const useAuth = () => useContext(AuthContext)

// export default function AuthContextProvider({ children }) {
    
// const [currentUser, setCurrentUser] = useState(null)
// const [isLoading, setIsLoading] = useState(true)

// useEffect(() =>{
//   const unsubscribe = onAuthStateChanged(auth, user => {
//       setCurrentUser(user)
//   })
//   return() => {
//       unsubscribe()
//   }
// }, [])


// const signIn = (email, password) => {
//     return signInWithEmailAndPassword(auth, email, password)
// }

// const logOut = () => {
//     return signOut(auth)
// }

// const value = {
//     currentUser,
//     signIn,
//     logOut
// }

// //   if (isLoading) {
// //     // Render a loading spinner or a message
// //     return <div>Loading...</div>;
// //   } else if (currentUser) {
// //     // Render the children component, since the user is authenticated
// //     return (
// //       <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// //     );
// //   } else {
// //     // Render the Signin component, since the user is not authenticated
// //     return (
// //       <AuthContext.Provider value={value}>
// //         <Signin />
// //       </AuthContext.Provider>
// //     );
// //   }
// // }

// //     return <AuthContext.Provider value={value}>
// //     {/* {children} */}
// //     {isLoading ? (
// //   <div>Loading...</div>
// // ) : currentUser ? (
// //   children
// // ) : (
// //   <Signin />
// // )}

// //   </AuthContext.Provider>
// // }

// return (
//     <AuthContext.Provider value={value}>
//         {children}
//     </AuthContext.Provider>
//   );
// }  


