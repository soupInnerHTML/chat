import {toast} from 'react-toastify';
import {onError} from "@apollo/client/link/error";

window.onunhandledrejection = (event) => {
    event.preventDefault();
};

export const errorLink = onError(({ networkError, graphQLErrors, forward, operation }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
            toast.error(`Error: Message: ${message}, Location: ${locations}, Path: ${path}`);
        });
    }

    if (networkError) {
        toast.error(`Network error: ${networkError}`);
    }

    return forward(operation);
});
