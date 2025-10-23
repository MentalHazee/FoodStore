export function navigateTo(path:string): void{
    const basePath = path.startsWith('/') ? path: '/' + path;
    window.location.href = basePath
}