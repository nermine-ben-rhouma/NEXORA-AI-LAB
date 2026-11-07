from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage

from app.core.config import settings


def get_ai_model():
    if not settings.GROQ_API_KEY:
        raise ValueError(
            "GROQ_API_KEY n'est pas configurée dans le fichier .env"
        )

    return ChatGroq(
        model=settings.GROQ_MODEL,
        groq_api_key=settings.GROQ_API_KEY,
        temperature=0.3,
        max_tokens=1024
    )


def answer_document_question(
    document_text: str,
    question: str
) -> str:

    llm = get_ai_model()

    system_prompt = """
    Tu es DOCUVISION, un assistant intelligent spécialisé
    dans l'analyse de documents PDF.

    Règles :
    - Réponds principalement à partir du document.
    - Sois clair, précis et professionnel.
    - Utilise la langue de l'utilisateur.
    - Si l'information est absente, indique-le clairement.
    - N'invente aucune information.
    """

    # Limiter le contenu envoyé à Groq
    limited_text = document_text[:6000]

    human_prompt = f"""
    CONTENU DU DOCUMENT :
    {limited_text}

    QUESTION :
    {question}

    Réponds de manière claire et concise.
    """

    response = llm.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=human_prompt)
    ])

    return response.content