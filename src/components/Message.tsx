import cn from "clsx";
import {MessageSender,} from "../../__generated__/resolvers-types.ts";
import css from "./Chat/Chat.module.css";
import {VirtuosoMessageProps} from "../types/virtuoso.ts";

export const Message: VirtuosoMessageProps = ({ data: {sender, text} }) => {
    return (
        <div className={css.item}>
            <div
                className={cn(
                    css.message,
                    sender === MessageSender.Admin ? css.out : css.in
                )}
            >
                {text}
            </div>
        </div>
    );
};

