from typing import Any, Dict

from pydantic import Field

from .base_config import BaseConfig


class DBConfig(BaseConfig):
    """Database configuration"""

    engine: str = Field("django.db.backends.mysql")
    host: str = Field("")
    port: str = Field("")
    charset: str = Field("utf8mb4")
    name: str
    user: str
    password: str

    def to_settings(self) -> Dict[str, Any]:
        """Convert to Django settings format"""
        return {
            "ENGINE": self.engine,
            "HOST": self.host,
            "PORT": self.port,
            "NAME": self.name,
            "USER": self.user,
            "PASSWORD": self.password,
            "OPTIONS": {
                "charset": self.charset,
            },
        }

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        env_prefix = "DB_"


db_config = DBConfig()
