from typing import List, Tuple
from app.models.models import ScreeningResult

def perform_screening(answers: List[str]) -> Tuple[ScreeningResult, str]:
    """
    Perform an AI screening based on user answers.
    
    In a real application, this would use a more sophisticated AI model
    to analyze the answers and determine if the user needs professional help.
    
    For this demo, we'll use a simple keyword-based approach.
    """
    lowercase_answers = [answer.lower() for answer in answers]
    
    severe_keywords = [
        "suicide", "kill myself", "end my life", "don't want to live",
        "harm myself", "self-harm", "cutting myself", 
        "hallucination", "hearing voices", "seeing things",
        "paranoid", "everyone is watching me", "government tracking"
    ]
    
    moderate_keywords = [
        "depressed", "anxious", "panic attack", "can't sleep",
        "no energy", "hopeless", "worthless", "trauma",
        "abuse", "violent", "alcohol", "drugs", "addiction"
    ]
    
    for keyword in severe_keywords:
        if any(keyword in answer for answer in lowercase_answers):
            return (
                ScreeningResult.BLOCK, 
                "Based on your responses, we recommend seeking immediate professional help. "
                "Please contact a mental health professional or emergency services."
            )
    
    for keyword in moderate_keywords:
        if any(keyword in answer for answer in lowercase_answers):
            return (
                ScreeningResult.REFER, 
                "Based on your responses, we recommend consulting with a professional counselor. "
                "You can still use our platform, but professional guidance is advised."
            )
    
    return (
        ScreeningResult.PASS, 
        "Thank you for completing the screening. You can now use our platform to connect with counselors."
    )
