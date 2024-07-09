export function returnSVGS() {
    const svgs = importAll(require.context('../../../downloaded_images/icons', true, /\.svg$/));
    return svgs;
}

function importAll(r) {
    let images = {};
    r.keys().forEach(key => {
        const fileName = key.replace('./', ''); // Get the original file name
        images[fileName] = r(key).default; // Get the URL/path to the SVG file
    });
    return images;
}