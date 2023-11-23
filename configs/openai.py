from pydantic import Field

from .base_config import BaseConfig


class OpenAiConfig(BaseConfig):
    """Configurations for OpenAI API"""

    api_type: str = Field("azure")
    version: str = Field("2023-08-01-preview")
    key: str
    url: str
    model: str
    deployment: str

    class Config:
        env_prefix = "OPENAI_"
        env_file = ".env"


openai_config = OpenAiConfig()
