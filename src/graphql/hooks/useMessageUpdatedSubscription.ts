import {useSubscription} from "@apollo/client";
import {MESSAGE_UPDATED_SUBSCRIPTION} from "../queries/messageSubscription.ts";
import {Message, Subscription} from "../../../__generated__/resolvers-types.ts";
import {useState} from "react";

export const useMessageUpdatedSubscription = () => {
    const [updatedMessage, setUpdatedMessage] = useState<Message | undefined>();
    useSubscription<Subscription>(MESSAGE_UPDATED_SUBSCRIPTION, {
        onData: ({ data: { data } }) => {
            if(data) {
                setUpdatedMessage(data.messageUpdated)
            }
        },
    });

    return {updatedMessage}
}
