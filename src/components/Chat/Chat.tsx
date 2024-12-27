import React, {useCallback, useEffect, useRef} from "react";
import {Message as TMessage,} from "../../../__generated__/resolvers-types.ts";
import css from "./Chat.module.css";
import {ApolloError} from "@apollo/client";
import {Message} from "../Message.tsx";
import {Loading} from "../Loading";
import {ErrorToast} from '../ErrorToast'
import {
    ListScrollLocation,
    VirtuosoMessageList,
    VirtuosoMessageListLicense,
    VirtuosoMessageListMethods,
} from "@virtuoso.dev/message-list";
import {useMessagesQuery} from "../../graphql/hooks/useMessagesQuery.ts";
import usePrevious from "../../graphql/hooks/usePrevious.ts";

export const Chat: React.FC = () => {
    const {
        loading,
        error,
        setError,
        messages,
        loadMoreMessages,
        pageInfo
    } = useMessagesQuery()

    const {isSame} = usePrevious(messages)
    const messageListRef = useRef<VirtuosoMessageListMethods<TMessage>>(null)

    useEffect(() => {
        if(messages.length && !loading && !error && !isSame) {
            requestAnimationFrame(() => {
                messageListRef.current?.data.prepend(messages)
            })
        }
    }, [loading, error, isSame]);


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
                    <VirtuosoMessageList<TMessage, unknown>
                        ref={messageListRef}
                        computeItemKey={({data}) => data.id}
                        initialLocation={{index: 'LAST'}}
                        className={css.list}
                        initialData={undefined}
                        ItemContent={Message}
                        onScroll={onScroll}
                    />
                </VirtuosoMessageListLicense>
            </div>
            <form onSubmit={e => e.preventDefault()} className={css.footer}>
                <input
                    required
                    type="text"
                    className={css.textInput}
                    placeholder="Message text"
                />
                <button>Send</button>
            </form>
        </div>
    );
};
