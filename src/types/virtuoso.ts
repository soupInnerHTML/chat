import {VirtuosoMessageListProps} from "@virtuoso.dev/message-list";
import {Message} from "../../__generated__/resolvers-types.ts";

export type MessageListContext = unknown
export type VirtuosoProps = VirtuosoMessageListProps<Message, MessageListContext>
export type VirtuosoMessageProps = VirtuosoProps['ItemContent']