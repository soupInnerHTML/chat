import {VirtuosoMessageListProps} from "@virtuoso.dev/message-list";
import {Message} from "../../__generated__/resolvers-types.ts";

export type MessageListContext = unknown
export type MessageListProps = VirtuosoMessageListProps<Message, MessageListContext>
export type MessageProps = MessageListProps['ItemContent']