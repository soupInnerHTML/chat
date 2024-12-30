import {useApolloClient, useSubscription} from "@apollo/client";
import {MESSAGE_ADDED_SUBSCRIPTION} from "../queries";
import {Message, Subscription} from "../../../__generated__/resolvers-types.ts";
import {useState} from "react";
import {getServerId} from "../../utils";

export const useMessageAddedSubscription = () => {
    const [newMessage, setNewMessage] = useState<Message | undefined>();
    const {cache} = useApolloClient()
    useSubscription<Subscription>(MESSAGE_ADDED_SUBSCRIPTION, {
        onData: ({ data: { data } }) => {
            if(data) {
                const newMessage = data.messageAdded

                setNewMessage(newMessage)

                cache.modify({
                    id: "ROOT_QUERY",
                    fields: {
                        messages(existingMessagesData = { edges: [] }) {
                            const newEdge = {
                                __typename: "MessageEdge",
                                node: newMessage,
                                cursor: getServerId(newMessage.id)
                            };

                            return {
                                ...existingMessagesData,
                                edges: [...existingMessagesData.edges, newEdge, ],
                            };
                        },
                    },
                });
            }
        },
    });

    return {newMessage}
}