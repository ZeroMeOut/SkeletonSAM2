/**
 * Function to handle the file upload.
 * It sends a POST request to the server with the uploaded file data.
 * If the upload is successful, it displays the uploaded image.
 * If there is an error, it displays the error message.
 */

let currentSegmentIndex = 0;
let segments = [];

function hideCarouselControls() {
    document.getElementById('prevButton').style.display = 'none';
    document.getElementById('nextButton').style.display = 'none';
}

function uploadFile() {
    // Get the form data and create a FormData object
    const formData = new FormData(document.getElementById('uploadForm'));
    
    // Send the POST request to the server
    fetch('/uploadcheck', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        const responseArea = document.getElementById('responseArea');
        responseArea.innerHTML = ''; // Clear previous content

        if (data.uploadstatus) {
            // Create and append the image
            const img = new Image();
            img.src = 'data:image/jpeg;base64,' + data.uploaddata;
            img.className = 'scaled-image';
            img.id = 'uploadedImage';
            responseArea.appendChild(img);

            // Add event listeners after the image is loaded
            img.onload = function() {
                img.addEventListener('click', clickListener);
            };
        } else {
            // Failure: display the error message
            const errorMessage = document.createTextNode(data.uploaddata);
            responseArea.appendChild(errorMessage);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const responseArea = document.getElementById('responseArea');
        responseArea.innerHTML = ''; // Clear previous content
        const errorMessage = document.createTextNode('An error occurred during upload.');
        responseArea.appendChild(errorMessage);
    });
    hideCarouselControls();
}

/**
 * Function to handle the click event on the image.
 * It captures the clicked position and the image data.
 * It prepares the data to send to the backend.
 */

function clickListener(event) {
    const { offsetX, offsetY } = event;
    const img = event.target;

    // Get the image data from the image
    const dataToSend = {
        x: offsetX,
        y: offsetY,
        image: img.src.split(',')[1]
    };

    sendValue(dataToSend);
}

function sendValue(dataToSend) {
    fetch('/process_image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const carouselInner = document.querySelector('.carousel-inner');
        carouselInner.innerHTML = ''; // Clear previous content
        segments = []; // Reset segments array
        currentSegmentIndex = 0; // Reset current index

        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
            const originalImage = document.getElementById('uploadedImage');
            loadImages(data.images, originalImage).then(() => {
                if (segments.length > 0) {
                    showSegment(0);
                    setupCarouselControls();
                    document.getElementById('prevButton').style.display = 'block';
                    document.getElementById('nextButton').style.display = 'block';
                } else {
                    carouselInner.textContent = 'No processed images received.';
                    hideCarouselControls();
                }
            });
        } else {
            carouselInner.textContent = 'No processed images received.';
            hideCarouselControls();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const carouselInner = document.querySelector('.carousel-inner');
        carouselInner.textContent = 'An error occurred while processing the image.';
        hideCarouselControls();
    });
}

async function loadImages(imagePaths, originalImage) {
    for (const imagePath of imagePaths) {
        try {
            const response = await fetch(imagePath);
            const blob = await response.blob();
            const objectURL = URL.createObjectURL(blob);
            const img = new Image();
            img.src = objectURL;
            img.alt = `Processed Image ${segments.length + 1}`;
            img.className = 'processed-image';
            img.style.width = originalImage.width + 'px';
            img.style.height = originalImage.height + 'px';
            segments.push(img);
        } catch (error) {
            console.error('Error loading image:', error);
        }
    }
}

function showSegment(index) {
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.innerHTML = '';
    carouselInner.appendChild(segments[index]);
    currentSegmentIndex = index;
    updateCarouselControls();
}

function setupCarouselControls() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    prevButton.addEventListener('click', () => {
        if (currentSegmentIndex > 0) {
            showSegment(currentSegmentIndex - 1);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentSegmentIndex < segments.length - 1) {
            showSegment(currentSegmentIndex + 1);
        }
    });

    updateCarouselControls();
}

function updateCarouselControls() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    prevButton.disabled = currentSegmentIndex === 0;
    nextButton.disabled = currentSegmentIndex === segments.length - 1;
}