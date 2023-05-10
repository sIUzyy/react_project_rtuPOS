import React from "react";
import { Alert, Button, Typography } from "@material-tailwind/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
 
export default function AlertSuccess({onClose, successMessage}) {
  const [show, setShow] = React.useState(true);
 
  return (
    <React.Fragment>
    
      <Alert
        show={show}
        color="green"
        className="max-w-screen-md"
        icon={<CheckCircleIcon className="mt-px h-6 w-6" />}
        dismissible={{
          onClose: onClose,
          action: (
            <Button  variant="text" color="white" size="sm">
              Close
            </Button>
          ),
        }}
      >
        <Typography className='mr-5' variant="h5" color="white">
           {successMessage}
        </Typography>
       
      </Alert>
    </React.Fragment>
  );
}