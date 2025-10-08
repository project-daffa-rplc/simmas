// toastify helper
import { toast } from "react-toastify";

export const updateToastToSuccess = (id: string, message: string) => {
    toast.update(id, {
        render: message,
        type: "success",
        isLoading: false,
        hideProgressBar : true,
        autoClose: 3000,
        closeOnClick: true
    });
}

export const updateToastToError = (id: string, message: string) => {
    toast.update(id, {
        render: message,
        type: "error",
        isLoading: false,
        hideProgressBar : true,
        autoClose: 3000,
        closeOnClick: true
    });
}

let apiCalled: boolean
export const throttle = ( fn: () => {}, time: number) => {
    if (apiCalled) return;
    apiCalled = true
    fn()
    setTimeout(function() {
        apiCalled = false
    }, time);
}