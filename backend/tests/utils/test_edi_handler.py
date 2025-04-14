import pytest
from app.core.edi_handler import (
    sanitize_input,
    escape_special_chars,
    generate_edi_segment,
    generate_edi_message,
    parse_edi_message
)

def test_sanitize_input():
    assert sanitize_input("Test123") == "Test123"
    assert sanitize_input("Test 123") == "Test 123"
    assert sanitize_input("Test[123]") == "Test123"
    assert sanitize_input("Test\n123") == "Test123"
    assert sanitize_input("") == ""
    assert sanitize_input(None) == ""

def test_escape_special_chars():
    assert escape_special_chars("Test's") == "Test?'s"
    assert escape_special_chars("Test") == "Test"
    assert escape_special_chars("") == ""

def test_generate_edi_segment():
    cargo_item = {
        "cargo_type": "Container",
        "number_of_packages": 5,
        "container_number": "ABCD123456",
        "master_bill_of_lading_number": "MBL123",
        "house_bill_of_lading_number": "HBL456"
    }
    
    result = generate_edi_segment(cargo_item, 1)
    assert "LIN+1+I'" in result
    assert "PAC+++Container:67:95'" in result
    assert "PAC+5+1'" in result
    assert "RFF+AAQ:ABCD123456'" in result
    assert "RFF+MB:MBL123'" in result
    assert "RFF+BH:HBL456'" in result

def test_generate_edi_message():
    cargo_items = [
        {
            "cargo_type": "Container",
            "number_of_packages": 5,
            "container_number": "ABCD123456"
        },
        {
            "cargo_type": "Box",
            "number_of_packages": 10,
            "master_bill_of_lading_number": "MBL123"
        }
    ]
    
    result = generate_edi_message(cargo_items)
    assert "LIN+1+I'" in result
    assert "LIN+2+I'" in result
    assert "PAC+++Container:67:95'" in result
    assert "PAC+++Box:67:95'" in result
    assert "PAC+5+1'" in result
    assert "PAC+10+1'" in result
    assert "RFF+AAQ:ABCD123456'" in result
    assert "RFF+MB:MBL123'" in result

def test_parse_edi_message():
    edi_message = """LIN+1+I'
PAC+++Container:67:95'
PAC+5+1'
RFF+AAQ:ABCD123456'
RFF+MB:MBL123'
RFF+BH:HBL456'
LIN+2+I'
PAC+++Box:67:95'
PAC+10+1'
RFF+MB:MBL789'"""
    
    result = parse_edi_message(edi_message)
    assert len(result) == 2
    
    first_item = result[0]
    assert first_item["cargo_type"] == "Container"
    assert first_item["number_of_packages"] == 5
    assert first_item["container_number"] == "ABCD123456"
    assert first_item["master_bill_of_lading_number"] == "MBL123"
    assert first_item["house_bill_of_lading_number"] == "HBL456"
    
    second_item = result[1]
    assert second_item["cargo_type"] == "Box"
    assert second_item["number_of_packages"] == 10
    assert second_item["master_bill_of_lading_number"] == "MBL789"
    assert "container_number" not in second_item
    assert "house_bill_of_lading_number" not in second_item

def test_parse_edi_message_invalid_format():
    with pytest.raises(Exception):
        parse_edi_message("Invalid EDI format") 