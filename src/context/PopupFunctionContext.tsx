import React from 'react';

export interface PopupFunctionContextData {
  submit: (handleClose: () => void) => void;
  setContextValue?: (value: PopupFunctionContextData) => void;
}

const defaultContextValue: PopupFunctionContextData = {
  submit: (handleClose: () => void) => { const a = 1 },
};

const PopupFunctionContext = React.createContext<PopupFunctionContextData>(defaultContextValue);

export default PopupFunctionContext;
