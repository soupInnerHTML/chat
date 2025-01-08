import {ComputeItemKey, IndexLocationWithAlign, ItemContent} from "react-virtuoso";
import {Message} from './Message.tsx'
import {MessageContext, RenderMessage} from "../../../types/message.ts";

export const getMessage: ItemContent<RenderMessage, MessageContext> = (index, data) => <Message {...data} index={index}/>
export const computeMessageKey: ComputeItemKey<RenderMessage, MessageContext> = (index, item) => item?.id ?? `${index}-placeholder`
export const initialTopMostMessageIndex: number | IndexLocationWithAlign = {index: 'LAST'}