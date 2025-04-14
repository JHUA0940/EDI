import re
from typing import List, Dict, Any

def sanitize_input(value: str) -> str:
    """Sanitize input to only allow valid ASCII characters."""
    if not value:
        return ""
    # Remove any characters outside ASCII 32-126, including [ and ]
    return re.sub(r'[^\x20-\x7A]|\[|\]', '', value)

def escape_special_chars(value: str) -> str:
    """Escape special characters in EDI messages."""
    return value.replace("'", "?'")

def generate_edi_segment(cargo_item: Dict[str, Any], index: int) -> str:
    """Generate EDI segment for a single cargo item."""
    segments = []
    
    # Add LIN segment
    segments.append(f"LIN+{index}+I'")
    
    # Add cargo type segment
    cargo_type = sanitize_input(cargo_item["cargo_type"])
    segments.append(f"PAC+++{cargo_type}:67:95'")
    
    # Add number of packages segment
    num_packages = cargo_item["number_of_packages"]
    segments.append(f"PAC+{num_packages}+1'")
    
    # Add container number if present
    if cargo_item.get("container_number"):
        container_number = escape_special_chars(sanitize_input(cargo_item["container_number"]))
        segments.append("PCI+1'")
        segments.append(f"RFF+AAQ:{container_number}'")
    
    # Add master bill of lading if present
    if cargo_item.get("master_bill_of_lading_number"):
        master_bill = escape_special_chars(sanitize_input(cargo_item["master_bill_of_lading_number"]))
        segments.append("PCI+1'")
        segments.append(f"RFF+MB:{master_bill}'")
    
    # Add house bill of lading if present
    if cargo_item.get("house_bill_of_lading_number"):
        house_bill = escape_special_chars(sanitize_input(cargo_item["house_bill_of_lading_number"]))
        segments.append("PCI+1'")
        segments.append(f"RFF+BH:{house_bill}'")
    
    return "\n".join(segments)

def generate_edi_message(cargo_items: List[Dict[str, Any]]) -> str:
    """Generate complete EDI message from cargo items."""
    segments = []
    for index, item in enumerate(cargo_items, 1):
        segments.append(generate_edi_segment(item, index))
    return "\n".join(segments)

def parse_edi_message(edi_message: str) -> List[Dict[str, Any]]:
    """Parse EDI message into cargo items."""
    if not edi_message or not isinstance(edi_message, str):
        raise Exception("Invalid EDI format")
        
    cargo_items = []
    current_item = {}

    lines = edi_message.strip().split('\n')
    for line in lines:
        if line.startswith('LIN+'):
            if current_item:
                cargo_items.append(current_item)
            current_item = {}
        elif line.startswith('PAC+++'):
            cargo_type = line.split('+')[3].split(':')[0]
            if cargo_type:
                current_item['cargo_type'] = cargo_type
        elif line.startswith('PAC+') and not line.startswith('PAC+++'):
            num_packages = line.split('+')[1]
            if num_packages:
                current_item['number_of_packages'] = int(num_packages)
        elif line.startswith('RFF+AAQ:'):
            container_number = line.split(':')[1].rstrip("'").replace("?'", "'")
            if container_number:
                current_item['container_number'] = container_number
        elif line.startswith('RFF+MB:'):
            master_bill = line.split(':')[1].rstrip("'").replace("?'", "'")
            if master_bill:
                current_item['master_bill_of_lading_number'] = master_bill
        elif line.startswith('RFF+BH:'):
            house_bill = line.split(':')[1].rstrip("'").replace("?'", "'")
            if house_bill:
                current_item['house_bill_of_lading_number'] = house_bill

    if current_item:
        cargo_items.append(current_item)

    if not cargo_items:
        raise Exception("Invalid EDI format")

    return cargo_items
