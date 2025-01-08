import React, {memo} from "react";
import css from "./Chat.module.css";
import {Loading} from "../Loading";
import {ChatInput} from "./ChatInput";
import {ListRange, Virtuoso} from "react-virtuoso";
import {computeMessageKey, getMessage, initialTopMostMessageIndex} from "./Message";
import {useMessages, useMessageSubscriptions} from "../../hooks";
import {MESSAGES_LIMIT} from "../../graphql/params.ts";

export const Chat: React.FC = memo(() => {
    const {
        loading,
        messages,
        addMessage,
        updateMessage,
        loadMoreMessages,
        pageInfo,
    } = useMessages()
    useMessageSubscriptions({addMessage, updateMessage})

    const onRangeChanged = (e: ListRange) => {
        if (e.startIndex <= pageInfo?.startCursor && pageInfo?.hasPreviousPage) {
            const closestStartCursor = Math.round(e.startIndex / MESSAGES_LIMIT) * MESSAGES_LIMIT + 1;
            loadMoreMessages(closestStartCursor)
        }
    }

    return (
        <div className={css.root}>
            <div className={css.container}>
                <Loading loading={loading} />
                <Virtuoso
                    data={messages}
                    computeItemKey={computeMessageKey}
                    initialTopMostItemIndex={initialTopMostMessageIndex}
                    className={css.list}
                    itemContent={getMessage}
                    rangeChanged={onRangeChanged}
                    followOutput
                />
            </div>
            <ChatInput />
        </div>
    );
});
