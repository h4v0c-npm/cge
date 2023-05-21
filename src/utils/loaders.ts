export const LoadImage = (url: string): Promise<ImageBitmap> => fetch(url)
    .then((response: Response) => response.blob())
    .then((blob: Blob) => createImageBitmap(blob))
    .catch((err: ErrorEvent) => { throw err.message; });

export const LoadImages = (urls: string[]): Promise<ImageBitmap[]> =>
    Promise.all(urls.map((url: string) => LoadImage(url)))
        .catch((err: ErrorEvent) => { throw err.message; });
