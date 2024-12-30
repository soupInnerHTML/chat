import React, {memo} from "react";
import css from './Loading.module.css'
import cn from "clsx";
import {LoadingProps} from "./types.ts";

export const Loading: React.FC<LoadingProps> = memo(({loading}) => {
    return <div className={cn(css.loading, !loading && css.hidden)}>Loading...</div>
})