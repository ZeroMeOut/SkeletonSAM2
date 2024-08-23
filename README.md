


# SkeletonSAM2

SkeletonSAM2 is a barebones FastAPI image segmentation application that uses Meta's SAM2 model. This project provides a simple starting point for developers to integrate image segmentation capabilities with a web-based interface.

## Prerequisites

1. **Model Checkpoints**: Download the ![2024-08-23 12-55-20](https://github.com/user-attachments/assets/ca4f3432-aecd-469f-a285-0f5ca503db30)
SAM2 model checkpoints and place them in the `checkpoints` directory.
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

![2024-08-23 12-55-20](https://github.com/user-attachments/assets/d0609b86-320f-4d7f-91dc-0b7ebf069f56)

## Contributing

Feel free to open issues or submit 
pull requests to contribute to this project.

