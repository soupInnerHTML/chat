import css from './ErrorToast.module.css'
import React, {useEffect, useState} from "react";
import cn from "clsx";

interface ErrorProps {
    error: string | null
}

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
                <button className={css.action} onClick={() => setErrorDecoration(null)}>CLOSE</button>
            </div>
        </div>
    );
};

