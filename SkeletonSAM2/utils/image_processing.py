import cv2
import torch
import numpy as np
from numpy.typing import NDArray
from sam2.build_sam import build_sam2
from sam2.sam2_image_predictor import SAM2ImagePredictor
import base64
from typing import Any

def show_mask(mask: NDArray, random_color=False):
    if random_color:
        color = np.concatenate([np.random.random(3), np.array([0.6])], axis=0)
    else:
        color = np.array([30/255, 144/255, 255/255, 0.6])
    h, w = mask.shape[-2:]
    mask = mask.astype(np.uint8)
    mask_image = mask.reshape(h, w, 1) * color.reshape(1, 1, -1)
    return mask_image

def predictor():
    checkpoint = "checkpoints/sam2_hiera_large.pt"
    model_cfg = "../sam2_configs/sam2_hiera_l.yaml"
    predictor = SAM2ImagePredictor(build_sam2(model_cfg, checkpoint))
    return predictor

# Segment func
def segmented(input_json: Any, predictor: SAM2ImagePredictor) -> None:
    if input_json.get('image') is None:
        return []
    else:
        image_string = input_json.get('image')
        image_bytes = base64.b64decode(image_string)
        image_np = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        input_point = np.array([[input_json.get('x'), input_json.get('y')]])
        input_label = np.ones((input_point.shape[0],), dtype=int)

        with torch.inference_mode(), torch.autocast("cuda", dtype=torch.bfloat16):
            predictor.set_image(image_rgb)
            masks, scores, logits = predictor.predict(
                point_coords=input_point,
                point_labels=input_label,
                multimask_output=True,
            )

        sorted_ind = np.argsort(scores)[::-1]
        masks = masks[sorted_ind]
        scores = scores[sorted_ind]
        logits = logits[sorted_ind]

        masked_image_list = []

        for i, mask in enumerate(masks):
            mask_image = show_mask(mask)
            # Apply the mask to segment the image
            masked_image_list.append(mask_image)

        return masked_image_list

