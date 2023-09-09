import { isEqual } from "lodash";

export function useHttp() {
    return 'https'
}


export function useIsEqual(source: any, target: any) {
    return isEqual(source, target)
}