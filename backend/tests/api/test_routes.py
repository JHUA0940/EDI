from fastapi.testclient import TestClient
from app.main import app
from app.models.cargo import CargoRequest, CargoItem, EDIMessage

client = TestClient(app)


def test_generate_edi():
    cargo_request = {
        "items": [
            {
                "cargo_type": "FCL",
                "number_of_packages": 5,
                "container_number": "ABCD123456"
            }
        ]
    }

    response = client.post("/api/edi/generate", json=cargo_request)
    assert response.status_code == 200
    assert "message" in response.json()
    assert "LIN+1+I'" in response.json()["message"]
    assert "PAC+++FCL:67:95'" in response.json()["message"]
    assert "PAC+5+1'" in response.json()["message"]
    assert "RFF+AAQ:ABCD123456'" in response.json()["message"]


def test_generate_edi_invalid_input():
    cargo_request = {
        "items": [
            {
                "cargo_type": "",
                "number_of_packages": -1
            }
        ]
    }

    response = client.post("/api/edi/generate", json=cargo_request)
    assert response.status_code == 422  # Validation error


def test_decode_edi():
    edi_message = {
        "message": """LIN+1+I'
PAC+++FCL:67:95'
PAC+5+1'
RFF+AAQ:ABCD123456'
RFF+MB:MBL123'
RFF+BH:HBL456'"""
    }

    response = client.post("/api/edi/decode", json=edi_message)
    assert response.status_code == 200
    assert "items" in response.json()
    items = response.json()["items"]
    assert len(items) == 1
    assert items[0]["cargo_type"] == "FCL"
    assert items[0]["number_of_packages"] == 5
    assert items[0]["container_number"] == "ABCD123456"
    assert items[0]["master_bill_of_lading_number"] == "MBL123"
    assert items[0]["house_bill_of_lading_number"] == "HBL456"


def test_decode_edi_invalid_format():
    edi_message = {
        "message": "Invalid EDI format"
    }

    response = client.post("/api/edi/decode", json=edi_message)
    assert response.status_code == 500