from fastapi import APIRouter, HTTPException
from app.models.cargo import CargoRequest, EDIMessage, DecodedCargoResponse, CargoItem
from app.core.edi_handler import generate_edi_message, parse_edi_message
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/edi")

@router.post("/generate", response_model=EDIMessage)
async def generate_edi(cargo_request: CargoRequest):
    try:
        edi_message = generate_edi_message([
            item.model_dump(exclude_none=True) for item in cargo_request.items
        ])
        return {"message": edi_message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate EDI: {str(e)}")

@router.post("/decode", response_model=DecodedCargoResponse)
async def decode_edi(edi_message: EDIMessage):
    try:
        cargo_items_raw = parse_edi_message(edi_message.message)
        cargo_items = [
            CargoItem(**item).model_dump(exclude_none=True)
            for item in cargo_items_raw
        ]
        return JSONResponse(content={"items": cargo_items})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Invalid EDI format: {str(e)}")
