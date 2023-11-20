from typing import List

from pydantic import Field

from .base_config import BaseConfig


class DjangoConfig(BaseConfig):
    """Django config"""

    secret_key: str = Field()
    debug: bool = Field(False)
    allowed_hosts: List[str] = Field(["127.0.0.1", "localhost"])
    media_root: str = Field("media")
    media_url: str = Field("media/")
    email_backend: str = Field("django.core.mail.backends.smtp.EmailBackend")
    email_host: str = Field()
    email_port: int = Field(465)
    email_use_ssl: bool = Field(True)
    email_host_user: str = Field()
    email_host_password: str = Field()

    class Config:
        env_prefix = "DJANGO_"
        env_file = ".env"


django_config = DjangoConfig()
