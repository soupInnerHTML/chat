import {Message as TMessage, Message} from "../../__generated__/resolvers-types.ts";
import {MessagePageInfo} from "../../__generated__/resolvers-types.ts";

export type PlaceholderMessage = undefined
export type RenderMessage = PlaceholderMessage | Partial<Message>
export type MessageContext = unknown

export type AddMessageFunction = (message: TMessage) => void
export type UpdateMessageFunction = AddMessageFunction

export interface MessageSubscriptionsActions {
    addMessage: AddMessageFunction
    updateMessage: UpdateMessageFunction
}

export type UseMessagesReturn =  {
    loading: boolean;
    messages: RenderMessage[]
    pageInfo: MessagePageInfo | undefined
    loadMoreMessages: (startCursor: number) => void
} & MessageSubscriptionsActions