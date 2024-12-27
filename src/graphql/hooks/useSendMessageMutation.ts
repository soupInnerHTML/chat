import {useMutation} from "@apollo/client";
import {SEND_MESSAGE} from "../queries/sendMessage.ts";
import {Mutation} from "../../../__generated__/resolvers-types.ts";

export const useSendMessageMutation = () => {
    const [sendMessage, { loading, error, data }] = useMutation<Mutation>(SEND_MESSAGE);

    return {sendMessage, loading, error, data};
}