import {useMutation} from "@apollo/client";
import {SEND_MESSAGE} from "../queries";
import {Mutation} from "../../../__generated__/resolvers-types.ts";

export const useSendMessageMutation = () => {
    const [sendMessage, { loading, error, data }] = useMutation<Mutation>(SEND_MESSAGE, {
        fetchPolicy: 'no-cache',
    });

    return {
        sendMessage: (text: string) => sendMessage({variables: {text}}),
        loading,
        error,
        data
    };
}