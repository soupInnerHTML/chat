export function getServerId(extendedId: string): string {
    // usable for recurring customer messages
    return extendedId.split('-')[0]
}