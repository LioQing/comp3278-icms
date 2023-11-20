from typing import Tuple, Type

from pydantic_settings import BaseSettings, PydanticBaseSettingsSource


class BaseConfig(BaseSettings):
    """Base configuration"""

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: Type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> Tuple[PydanticBaseSettingsSource, ...]:
        """Change source priority order so .env file is loaded first"""
        return (
            init_settings,
            dotenv_settings,
            env_settings,
            file_secret_settings,
        )
