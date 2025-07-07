import boto3
from core.config import settings
from mypy_boto3_dynamodb import DynamoDBServiceResource

boto_config = {
    "region_name": settings.aws_region,
}

db_client: DynamoDBServiceResource = boto3.resource(
    "dynamodb", region_name=settings.aws_region
)
