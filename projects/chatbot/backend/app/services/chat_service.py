from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

from app.core.config import settings


def get_chat_model():
    if not settings.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY n'est pas configurée dans le fichier .env")

    return ChatGroq(
        model=settings.GROQ_MODEL,
        groq_api_key=settings.GROQ_API_KEY,
        temperature=0.7,
        max_tokens=2048
    )


def generate_response(message: str, conversation_history: list):
    llm = get_chat_model()

    messages = [
        SystemMessage(
            content=(
                "Tu es NEXORA CHAT, un assistant IA intelligent, "
                "professionnel et sympathique. "
                "Tu réponds clairement et dans la langue utilisée "
                "par l'utilisateur."
            )
        )
    ]

    for item in conversation_history:
        if item.role == "user":
            messages.append(HumanMessage(content=item.content))
        elif item.role == "assistant":
            messages.append(AIMessage(content=item.content))

    messages.append(HumanMessage(content=message))

    response = llm.invoke(messages)

    return response.content 