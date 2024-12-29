import css from './ErrorToast.module.css'
import React, {useEffect, useState} from "react";
import cn from "clsx";
import {ErrorProps} from "./types.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

export const ErrorToast: React.FC<ErrorProps> = ({error}) => {
    const [errorDecoration, setErrorDecoration] = useState(error)
    useEffect(() => {
        if(errorDecoration !== error) {
            setErrorDecoration(error)
        }
    }, [error]);

    return (
        <div className={cn(css.errorContainer, !errorDecoration && css.hidden)}>
            <p className={css.error}>{error}</p>
            <div className={css.actions}>
                <button className={css.action} onClick={() => setErrorDecoration(null)}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
        </div>
    );
};

