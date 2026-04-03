export function floodFill(ctx, x, y, fillColor) {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Get the target color at the clicked position
    const targetColorOffset = (y * width + x) * 4;
    const targetR = data[targetColorOffset];
    const targetG = data[targetColorOffset + 1];
    const targetB = data[targetColorOffset + 2];
    const targetA = data[targetColorOffset + 3];

    // Convert fill color (hex) to RGBA
    const fillR = parseInt(fillColor.slice(1, 3), 16);
    const fillG = parseInt(fillColor.slice(3, 5), 16);
    const fillB = parseInt(fillColor.slice(5, 7), 16);
    const fillA = 255; // Assuming full opacity for now

    // If the target color is the same as the fill color, return immediately
    if (
        targetR === fillR &&
        targetG === fillG &&
        targetB === fillB &&
        targetA === fillA
    ) {
        return;
    }

    const stack = [[x, y]];

    while (stack.length > 0) {
        const [currentX, currentY] = stack.pop();
        const currentOffset = (currentY * width + currentX) * 4;

        if (
            currentX >= 0 &&
            currentX < width &&
            currentY >= 0 &&
            currentY < height &&
            matchColor(data, currentOffset, targetR, targetG, targetB, targetA)
        ) {
            setColor(data, currentOffset, fillR, fillG, fillB, fillA);

            stack.push([currentX + 1, currentY]);
            stack.push([currentX - 1, currentY]);
            stack.push([currentX, currentY + 1]);
            stack.push([currentX, currentY - 1]);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function matchColor(data, offset, r, g, b, a) {
    return (
        data[offset] === r &&
        data[offset + 1] === g &&
        data[offset + 2] === b &&
        data[offset + 3] === a
    );
}

function setColor(data, offset, r, g, b, a) {
    data[offset] = r;
    data[offset + 1] = g;
    data[offset + 2] = b;
    data[offset + 3] = a;
}
