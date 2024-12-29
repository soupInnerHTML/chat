import React, {useCallback, useEffect, useRef} from "react";
import {Message as TMessage,} from "../../../__generated__/resolvers-types.ts";
import css from "./Chat.module.css";
import {ApolloError} from "@apollo/client";
import {Message} from "./Message";
import {Loading} from "../Loading";
import {ErrorToast} from '../ErrorToast'
import {
    ListScrollLocation,
    VirtuosoMessageList,
    VirtuosoMessageListLicense,
    VirtuosoMessageListMethods,
} from "@virtuoso.dev/message-list";
import {useMessagesQuery} from "../../graphql/hooks/useMessagesQuery.ts";
import {ChatInput} from "./ChatInput";
import {useMessageAddedSubscription} from "../../graphql/hooks/useMessageAddedSubscription.ts";
import {MessageListContext} from "../../types/virtuoso.ts";
import {useMessageUpdatedSubscription} from "../../graphql/hooks/useMessageUpdatedSubscription.ts";
import {differenceBy} from "lodash-es";

export const Chat: React.FC = () => {
    const {
        loading,
        error,
        setError,
        messages,
        loadMoreMessages,
        pageInfo
    } = useMessagesQuery()
    const {newMessage} = useMessageAddedSubscription()
    const {updatedMessage} = useMessageUpdatedSubscription()

    const messageListRef = useRef<VirtuosoMessageListMethods<TMessage>>(null)

    useEffect(() => {
        if(newMessage) {
            messageListRef.current?.data.append([newMessage], () => true)
        }
    }, [newMessage?.id]);

    useEffect(() => {
        if(updatedMessage) {
            messageListRef.current?.data.map(message => {
                return message.id === updatedMessage.id ? updatedMessage : message
            })
        }
    }, [updatedMessage?.id, updatedMessage?.status])

    useEffect(() => {
        if(messageListRef.current && messages.length && !loading && !error) {
            requestAnimationFrame(() => {
                const batch = differenceBy(messages, messageListRef.current!.data.get(), "id")
                if(batch.length) {
                    messageListRef.current!.data.prepend(batch)
                }
            })
        }
    }, [messages.length]);


    const onScroll = useCallback(
        async (location: ListScrollLocation) => {
            try {
                // offset is 0 at the top, -totalScrollSize + viewportHeight at the bottom
                if (location.listOffset > -100 && pageInfo?.hasPreviousPage && !loading) {
                    loadMoreMessages(pageInfo.startCursor)
                }
            }
            catch (e) {
                setError((e as ApolloError).message)
            }
        },
        [loading, pageInfo?.hasPreviousPage]
    )

    return (
        <div className={css.root}>
            <ErrorToast error={error} />
            <div className={css.container}>
                <Loading loading={loading} />
                <VirtuosoMessageListLicense licenseKey="">
                    <VirtuosoMessageList<TMessage, MessageListContext>
                        ref={messageListRef}
                        computeItemKey={({data}) => data.id}
                        initialLocation={{index: 'LAST'}}
                        className={css.list}
                        ItemContent={Message}
                        onScroll={onScroll}
                    />
                </VirtuosoMessageListLicense>
            </div>
            <ChatInput />
        </div>
    );
};
