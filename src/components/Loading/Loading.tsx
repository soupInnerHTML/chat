import React from "react";
import css from './Loading.module.css'
import cn from "clsx";

interface LoadingProps {
    loading: boolean;
}

export const Loading: React.FC<LoadingProps> = ({loading}) => {
    return <div className={cn(css.loading, !loading && css.hidden)}>Loading...</div>
}