from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.schemas.cargo import CargoRequest, EDIMessage, DecodedCargoResponse, CargoItem
from app.utils.edi_utils import generate_edi_message, parse_edi_message

router = APIRouter()

@router.post("/generate-edi", response_model=EDIMessage)
async def generate_edi(cargo_request: CargoRequest):
    try:
        edi_message = generate_edi_message([item.dict() for item in cargo_request.items])
        return {"message": edi_message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/decode-edi", response_model=DecodedCargoResponse)
async def decode_edi(edi_message: EDIMessage):
    try:
        cargo_items = parse_edi_message(edi_message.message)
        # Convert each dictionary to a CargoItem model and back to dict to remove None values
        cargo_items = [CargoItem(**item).dict(exclude_none=True) for item in cargo_items]
        return JSONResponse(content={"items": cargo_items})
    except Exception as e:
        raise HTTPException(status_code=500, detail='Invalid EDI format')