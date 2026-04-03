export const convertPdfToImage = async (file) => {
    const pdfjsLib = window.pdfjsLib;

    if (!pdfjsLib) {
        throw new Error("PDF.js library not loaded");
    }

    const arrayBuffer = await file.arrayBuffer();

    // Load the document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    // Get the first page
    const page = await pdf.getPage(1);

    // Determine scale to fit a reasonable canvas size (e.g. width of 1000px)
    const originalViewport = page.getViewport({ scale: 1.0 });
    const desiredWidth = 1000;
    const scale = desiredWidth / originalViewport.width;
    const viewport = page.getViewport({ scale: scale });

    // Prepare canvas using viewport dimensions
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };

    await page.render(renderContext).promise;
    return canvas.toDataURL('image/png');
};
