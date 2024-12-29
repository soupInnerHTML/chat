import cn from "clsx";
import {MessageSender, MessageStatus,} from "../../../../__generated__/resolvers-types.ts";
import css from "./Message.module.css";
import {VirtuosoMessageProps} from "../../../types/virtuoso.ts";
import { FontAwesomeIcon as StatusIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import {useMemo} from "react";

export const Message: VirtuosoMessageProps = ({
    data: {sender, text, status, updatedAt},
}) => {
    const icon = useMemo(() => {
        switch (status) {
            case MessageStatus.Sending: return {
                icon: faCheck,
                className: cn(css.statusIcon, css.sending)
            }
            case MessageStatus.Sent: return {
                icon: faCheckDouble,
                className: cn(css.statusIcon, css.sent)
            }
            case MessageStatus.Read: return {
                icon: faCheckDouble,
                className: cn(css.statusIcon, css.read)
            }
        }
    }, [status])

    const isOutgoingMessage = sender === MessageSender.Admin

    const time = useMemo(() => {
        const date = new Date(updatedAt)
        const hours = date.getHours()
        const minutes = date.getMinutes()
        return `${hours}:${minutes < 10 ? 0 : ""}${minutes}`
    }, [updatedAt])

    return (
        <div className={css.item}>
            <div
                className={cn(
                    css.message,
                    isOutgoingMessage ? css.out : css.in
                )}
            >
                <span className={css.messageText}>{text}</span>
                <div className={css.info}>
                    <p className={css.time}>{time}</p>
                    {isOutgoingMessage && <StatusIcon {...icon} />}
                </div>
            </div>
        </div>
    );
};

