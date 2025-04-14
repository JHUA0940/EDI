from pydantic import BaseModel, Field
from typing import List, Optional

class CargoItem(BaseModel):
    cargo_type: str = Field(..., pattern="^(FCX|LCL|FCL)$")
    number_of_packages: int = Field(..., gt=0)
    container_number: Optional[str] = None
    master_bill_of_lading_number: Optional[str] = None
    house_bill_of_lading_number: Optional[str] = None

    class Config:
        json_encoders = {
            Optional[str]: lambda v: v or None  # Return None for empty strings
        }

    def dict(self, *args, **kwargs):
        # Override dict method to exclude None values
        d = super().dict(*args, **kwargs)
        return {k: v for k, v in d.items() if v is not None}

class CargoRequest(BaseModel):
    items: List[CargoItem]

class EDIMessage(BaseModel):
    message: str

class DecodedCargoItem(BaseModel):
    cargo_type: str
    number_of_packages: int
    container_number: Optional[str] = None
    master_bill_of_lading_number: Optional[str] = None
    house_bill_of_lading_number: Optional[str] = None

class DecodedCargoResponse(BaseModel):
    items: List[DecodedCargoItem] 