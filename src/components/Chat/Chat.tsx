import React, {memo, useCallback, useEffect, useRef} from "react";
import {Message as TMessage,} from "../../../__generated__/resolvers-types.ts";
import css from "./Chat.module.css";
import {Message} from "./Message";
import {Loading} from "../Loading";
import {
    ListScrollLocation,
    VirtuosoMessageList,
    VirtuosoMessageListLicense,
    VirtuosoMessageListMethods,
} from "@virtuoso.dev/message-list";
import {
    useMessagesQuery,
    useMessageUpdatedSubscription,
    useMessageAddedSubscription
} from "../../graphql/hooks";
import {ChatInput} from "./ChatInput";
import {MessageListContext} from "../../types/messageList.ts";
import {differenceBy} from "lodash-es";

export const Chat: React.FC = memo(() => {
    const {
        loading,
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
        if(messageListRef.current && messages.length && !loading) {
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
            // offset is 0 at the top, -totalScrollSize + viewportHeight at the bottom
            if (location.listOffset > -100 && pageInfo?.hasPreviousPage && !loading) {
                loadMoreMessages(pageInfo.startCursor)
            }
        },
        [loading, pageInfo?.hasPreviousPage]
    )

    return (
        <div className={css.root}>
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
});
