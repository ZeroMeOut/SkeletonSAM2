from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import base64
from utils.image_processing import segmented, predictor
from PIL import Image
import numpy as np
import os

cached_model = predictor()

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory='templates')

@app.post("/uploadcheck")
def upload(request: Request, file: UploadFile = File(...)):
    try:
        contents = file.file.read()
        with open(f"static/images/{file.filename}", 'wb') as f:
            f.write(contents)
        
        base64_encoded = base64.b64encode(contents).decode('utf-8')

        return JSONResponse({
            "uploadstatus": True, 
            "uploaddata": base64_encoded,
            "filename": file.filename
        })
    except Exception as e:
        return JSONResponse({
            "uploadstatus": False, 
            "uploaddata": f"There was an error uploading the file: {str(e)}"
        })
    finally:
        file.file.close()

@app.get('/', response_class=HTMLResponse)
def main(request: Request):
    return templates.TemplateResponse('index.html', {'request': request})

@app.post("/process_image")
async def process_image(request: Request):
    data = (await request.json())

    image_data = data['image']
    x = data['x']
    y = data['y']
    output = segmented({'image': image_data, 'x': x, 'y': y}, cached_model)
    output_images = []

    # Convert the output to a suitable format
    for i in range(len(output)):
        image_path = f"static/images/{i}.png"
        if os.path.exists(image_path):
            os.remove(image_path)
        image_pil = Image.fromarray((output[i] * 255).astype(np.uint8))
        image_pil.save(image_path)
        output_images.append("static/images/"+str(i)+".png")
                                       

    return JSONResponse(content={"message": "Image processed successfully", "images": output_images})