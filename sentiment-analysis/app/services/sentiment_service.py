from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings
import json


def analyze_sentiment(text: str):
    """
    Analyse le sentiment d'un texte avec LangChain et Groq.
    Retourne : positif, négatif ou neutre.
    """

    if not settings.GROQ_API_KEY:
        raise ValueError("La clé API Groq n'est pas configurée.")

    llm = ChatGroq(
        groq_api_key=settings.GROQ_API_KEY,
        model=settings.GROQ_MODEL,
        temperature=0
    )

    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            """
            Tu es un expert en analyse de sentiment.

            Analyse le texte fourni et identifie son sentiment principal.

            Tu dois retourner uniquement un objet JSON valide avec les champs :
            - sentiment : positif, négatif ou neutre
            - confidence : un nombre entre 0 et 100
            - explanation : une courte explication en français

            Ne retourne aucun texte avant ou après le JSON.
            """
        ),
        ("human", "{text}")
    ])

    chain = prompt | llm

    response = chain.invoke({"text": text})

    try:
        result = json.loads(response.content)

        sentiment = result.get("sentiment", "").lower()

        if sentiment not in ["positif", "négatif", "neutre"]:
            raise ValueError("Sentiment invalide retourné par le modèle.")

        confidence = float(result.get("confidence", 0))

        if not 0 <= confidence <= 100:
            raise ValueError("Niveau de confiance invalide.")

        return {
            "sentiment": sentiment,
            "confidence": confidence,
            "explanation": result.get("explanation", "")
        }

    except (json.JSONDecodeError, TypeError, ValueError) as error:
        raise RuntimeError(
            f"Impossible d'interpréter la réponse du modèle : {error}"
        )