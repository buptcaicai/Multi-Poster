from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # AWS configuration
    aws_region: str
    # Redis configuration
    redis_host: str
    redis_password: str
    redis_port: int

    # MongoDB configuration
    mongo_db_uri: str
    mongo_db_user: str
    mongo_db_pass: str

    # Admin configuration
    admin_username: str
    admin_password: str
    admin_email: str

    # JWT configuration
    jwt_secret: str
    jwt_expires_in: int

    model_config = {
      "env_file": ".env",
      "case_sensitive": False
   }

settings = Settings()  # type: ignore
