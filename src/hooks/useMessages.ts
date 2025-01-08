import {useMessagesCountQuery, useMessagesQuery} from "../graphql/hooks";
import {useEffect, useRef, useState} from "react";
import {Message as TMessage} from "../../__generated__/resolvers-types.ts";
import {AddMessageFunction, PlaceholderMessage, UpdateMessageFunction, UseMessagesReturn} from "../types/message.ts";
import {getMessages, generatePlaceholderMessages} from "../utils";
import {MESSAGES_LIMIT} from "../graphql/params.ts";

export const useMessages = (): UseMessagesReturn => {
    const totalMessagesCount = useMessagesCountQuery()
    const {loading, data, fetchMore} = useMessagesQuery(totalMessagesCount)

    const [messages, setMessages] = useState<(TMessage | PlaceholderMessage)[]>([])

    useEffect(() => {
        if(data?.messages.edges.length && !messages.length && !loading) {
            const _messages = getMessages(data)
            setMessages([...generatePlaceholderMessages(totalMessagesCount - _messages.length), ..._messages])
        }
    }, [data?.messages.edges.length, messages.length, loading])

    const previousStartCursors = useRef<number[]>([])
    const loadMoreMessages = async (startCursor: number) => {
        if(!previousStartCursors.current.includes(startCursor)) {
            previousStartCursors.current.push(startCursor);
            const after = Math.max(startCursor - MESSAGES_LIMIT - 1, -1)
            const {data} = await fetchMore({
                variables: {
                    after: String(after),
                    first: Math.min(MESSAGES_LIMIT, startCursor)
                },
                updateQuery: (previousQueryResult, {fetchMoreResult}) => {
                    if (!fetchMoreResult) return previousQueryResult;

                    return {
                        messages: {
                            ...fetchMoreResult.messages,
                            edges: [
                                ...fetchMoreResult.messages.edges,
                                ...previousQueryResult.messages.edges,
                            ],
                            pageInfo: {
                                ...fetchMoreResult.messages.pageInfo,
                                endCursor: previousQueryResult.messages.pageInfo.endCursor,
                                startCursor: fetchMoreResult.messages.pageInfo.startCursor,
                            },
                        },
                    };
                },
            });

            setMessages((current) => {
                const newMessages = getMessages(data)
                const currentLoaded = current.filter(Boolean)
                return [
                    ...generatePlaceholderMessages(totalMessagesCount - newMessages.length - currentLoaded.length),
                    ...newMessages,
                    ...currentLoaded
                ]
            })
        }
    };

    const addMessage: AddMessageFunction = (message) => {
        setMessages(current => [...current, message])
    }
    const updateMessage: UpdateMessageFunction = (updatedMessage) => {
        setMessages(current => current.map(message => (
            message?.id === updatedMessage.id ? updatedMessage : message)
        ))
    }

    return {
        loading: loading || !messages.length,
        messages,
        addMessage,
        updateMessage,
        pageInfo: data?.messages.pageInfo,
        loadMoreMessages
    }
}