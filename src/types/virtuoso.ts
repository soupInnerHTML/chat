import {VirtuosoMessageListProps} from "@virtuoso.dev/message-list";
import {Message} from "../../__generated__/resolvers-types.ts";

export type VirtuosoProps = VirtuosoMessageListProps<Message, unknown>
export type VirtuosoMessageProps = VirtuosoProps['ItemContent']