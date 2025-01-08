import {useMessageAddedSubscription, useMessageUpdatedSubscription} from "../graphql/hooks";
import {useEffect} from "react";
import {MessageSubscriptionsActions} from "../types/message.ts";

export const useMessageSubscriptions = ({addMessage, updateMessage}: MessageSubscriptionsActions) => {
    const {newMessage} = useMessageAddedSubscription()
    useEffect(() => {
        if(newMessage) {
            addMessage(newMessage)
        }
    }, [newMessage?.id]);

    const {updatedMessage} = useMessageUpdatedSubscription()
    useEffect(() => {
        if(updatedMessage) {
            updateMessage(updatedMessage)
        }
    }, [updatedMessage?.id, updatedMessage?.status])
}