


# SkeletonSAM2

SkeletonSAM2 is a barebones FastAPI image segmentation application that uses Meta's SAM2 model. This project provides a simple starting point for developers to integrate image segmentation capabilities with a web-based interface.

## Prerequisites

1. **Model Checkpoints**: Download the required SAM2 model checkpoints and place them in the `checkpoints` directory.
2. **Python 3.8+**: Ensure you have Python version 3.8 or above installed.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ZeroMeOut/SkeletonSAM2.git
   cd SkeletonSAM2
   ```
   
2. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

2. Navigate to `http://localhost:8000` in your web browser to access the image segmentation interface.

3.  ![Demo](https://github.com/user-attachments/assets/4ecf9a67-e7a5-4520-991c-de92f11d9c18)

## Contributing

Feel free to open issues or submit pull requests to contribute to this project.

