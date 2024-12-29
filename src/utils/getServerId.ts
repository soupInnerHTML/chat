export function getServerId(extendedId: string): string {
    return extendedId.split('-')[0]
}