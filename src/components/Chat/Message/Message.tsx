import cn from "clsx";
import {MessageSender, MessageStatus} from "../../../../__generated__/resolvers-types.ts";
import css from "./Message.module.css";
import {FontAwesomeIcon as StatusIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faCheckDouble} from "@fortawesome/free-solid-svg-icons";
import React, {useMemo} from "react";
import Skeleton from "react-loading-skeleton";
import {RenderMessage} from "../../../types/message.ts";

export const Message: React.FC<RenderMessage & {index: number}> = ({sender, text, status, updatedAt, id, index}) => {
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
        if(updatedAt) {
            const date = new Date(updatedAt)
            const hours = date.getHours()
            const minutes = date.getMinutes()
            return `${hours}:${minutes < 10 ? 0 : ""}${minutes}`
        }
        return ""
    }, [updatedAt])

    if(id) {
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
                        {isOutgoingMessage && <StatusIcon {...icon!} />}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={css.item}>
            <div
                className={cn(
                    css.message,
                    index % 2 ? css.in : css.out
                )}
            >
                <span className={css.messageText}>
                    <Skeleton width={100} />
                </span>
                <div className={css.info}>
                    <p className={css.time}>
                        <Skeleton width={30} />
                    </p>
                </div>
            </div>
        </div>
    );
};

