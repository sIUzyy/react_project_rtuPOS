import React from "react";
import AuthContextProvider from "./Functions/authContext";
import MainRoutes from "./Routers/MainRoutes";
import { ReceiptContextProvider } from "./Functions/receiptContext";


function App() {
  return (
    <div className="App">
   
      <ReceiptContextProvider>
        <AuthContextProvider>
            <MainRoutes/>
        </AuthContextProvider>
      </ReceiptContextProvider>
    
    </div>
  );
}

export default App;
