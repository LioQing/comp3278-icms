from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings


class DjangoConfig(BaseSettings):
    """Django config"""

    secret_key: str = Field()
    debug: bool = Field(False)
    allowed_hosts: List[str] = Field(["127.0.0.1", "localhost"])

    class Config:
        env_prefix = "DJANGO_"
        env_file = ".env"


django_config = DjangoConfig()
