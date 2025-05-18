import uuid
from datetime import datetime

def generate_meeting_link() -> str:
    """
    Generate a mock Google Meet link.
    
    In a real application, this would integrate with the Google Meet API
    to create an actual meeting and return the link.
    """
    meeting_id = uuid.uuid4().hex[:10]
    
    return f"https://meet.google.com/{meeting_id}"
