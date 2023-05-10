import React from "react"
import { Dialog } from "@material-tailwind/react";
import QrCode from '../Assets/webp-img/fakeqr.webp'

export default function GWalletModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  return (
    <React.Fragment>
    <div className="">
    <button onClick={handleOpen} > G-Wallet </button>
    </div>
    <Dialog
      size="xs"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >

    <div className="max-w-7xl mx-auto">

        <div className="bg-[#F3EFF5] w-[420px] -ml-36   rounded-xl md:-ml-24 lg:ml-0 2xl:w-auto 2xl:h-auto">
            <div className="mx-5">
                    <img className="pt-5 md:ml-4" src={QrCode} alt="" />
                <div className="pt-5 mb-5">
                    <h1 className="text-black font-bold font-fontDash pb-5 text-center uppercase text-sm">PAY WITH G-CASH</h1>

                </div>

    
            </div>

        </div>
        
    </div>
      
    </Dialog>
  </React.Fragment>

  );
}