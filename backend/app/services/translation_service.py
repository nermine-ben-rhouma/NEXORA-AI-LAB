from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from app.core.config import settings


class TranslationService:

    def __init__(self):

        if not settings.GROQ_API_KEY:
            raise ValueError(
                "GROQ_API_KEY is missing. "
                "Please configure your .env file."
            )

        self.model = ChatGroq(
            model=settings.GROQ_MODEL,
            api_key=settings.GROQ_API_KEY,
            temperature=0.2,
            max_retries=2,
            timeout=60
        )

        self.prompt = ChatPromptTemplate.from_messages([
            (
                "system",
                """
                You are LINGUA AI, a professional multilingual
                translation assistant.

                Your mission is to produce accurate, natural,
                and context-aware translations.

                Rules:
                1. Translate the meaning, not just individual words.
                2. Preserve the original message and context.
                3. Maintain names, numbers and important details.
                4. Respect grammar and punctuation.
                5. Do not summarize or explain the text.
                6. Return only the translated text.
                7. Never invent information.

                Source language: {source_language}
                Target language: {target_language}
                Translation tone: {tone}

                If the source language is Auto-detect,
                identify it automatically.

                Adapt your vocabulary and writing style
                to the requested tone.
                """
            ),
            (
                "human",
                "Translate the following text:\n\n{text}"
            )
        ])

        self.chain = self.prompt | self.model | StrOutputParser()

    async def translate(
        self,
        text: str,
        source_language: str,
        target_language: str,
        tone: str
    ) -> str:

        result = await self.chain.ainvoke({
            "text": text,
            "source_language": source_language,
            "target_language": target_language,
            "tone": tone
        })

        translated_text = result.strip()

        if not translated_text:
            raise ValueError("The AI returned an empty translation.")

        return translated_text