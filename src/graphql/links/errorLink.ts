import {toast} from 'react-toastify';
import {onError} from "@apollo/client/link/error";
import {debounce} from "lodash-es";

const showError = debounce(toast.error, 500)
export const errorLink = onError(({ networkError, graphQLErrors, forward, operation }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
            showError(`Error: Message: ${message}, Location: ${locations}, Path: ${path}`);
        });
    }

    if (networkError) {
        showError(`Network error: ${networkError}`);
    }

    return forward(operation);
});
