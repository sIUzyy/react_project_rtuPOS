import React from 'react';
import { Alert, Button } from '@material-tailwind/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

export default function AlertErr({ onClose, errorMessage }) {
  return (
    <div className="pb-5">
      <React.Fragment>
        <Alert
          show={true}
          color="red"
          icon={<ExclamationTriangleIcon className="h-6 w-6" />}
          dismissible={{
            onClose: onClose,
            action: (
              <Button  variant="text" color="white" size="sm">
                Close
              </Button>
            ),
          }}
        >

            <h1 className='mr-5'>{errorMessage}</h1>
              </Alert>
      </React.Fragment>
    </div>
  );
}
