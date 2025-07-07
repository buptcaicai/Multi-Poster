from datetime import datetime
from mypy_boto3_dynamodb import DynamoDBServiceResource
from mypy_boto3_dynamodb.service_resource import Table
import uuid
import hashlib
from core.config import settings
from ..client import db_client

class UserPostTable:
    """
    Abstraction for the UserPost DynamoDB table.
    Provides methods to interact with user profiles and posts.
    """
    table: Table
    def __init__(self, db_client: DynamoDBServiceResource):
        existing_tables = [table.name for table in db_client.tables.all()]
        if "UserPost" not in existing_tables:
            db_client.create_table(
                TableName="UserPost",
                KeySchema=[
                    {"AttributeName": "PK", "KeyType": "HASH"},
                    {"AttributeName": "SK", "KeyType": "RANGE"},
                ],
                AttributeDefinitions=[
                    {"AttributeName": "PK", "AttributeType": "S"},
                    {"AttributeName": "SK", "AttributeType": "S"},
                ],
                BillingMode="PAY_PER_REQUEST",
            )
            db_client.meta.client.get_waiter("table_exists").wait(TableName="UserPost")
        self.table = db_client.Table("UserPost")
        self.put_user_profile(settings.admin_username, settings.admin_email, settings.admin_password)

    def put_user_profile(self, username: str, email: str, password: str):
        """
        Insert or update a user profile.
        """
        hashed_password = hashlib.sha256(password.encode("utf-8")).hexdigest()
        self.table.put_item(
            Item={
                "PK": f"USER#{username}",
                "SK": "PROFILE",
                "password": hashed_password,
                "email": email,
            }
        )

    def put_post(self, username: str, title: str, content: str):
        """
        Insert a post for a user.
        """
        created_at = datetime.now().isoformat()
        post_uuid = str(uuid.uuid4())[:8]
        post_key = f"POST#{created_at}#{post_uuid}"

        self.table.put_item(
            Item={
                "PK": f"USER#{username}",
                "SK": f"{post_key}",
                "title": title,
                "content": content,
            }
        )
        self.table.put_item(
            Item={
                "PK": f"{post_key}",
                "SK": "METADATA",
                "username": username,
                "title": title,
                "created_at": created_at,
            }
        )

    def get_user_profile(self, username: str):
        """
        Retrieve a user profile by username.
        """
        response = self.table.get_item(Key={"PK": f"USER#{username}", "SK": "PROFILE"})
        return response.get("Item")

    def get_user_posts(self, username: str):
        """
        Retrieve all posts for a user.
        """
        response = self.table.query(
            KeyConditionExpression="PK = :pk AND begins_with(SK, :sk)",
            ExpressionAttributeValues={":pk": f"USER#{username}", ":sk": "POST#"},
        )
        return response.get("Items", [])

    def get_post_metadata(self, post_id: str):
        """
        Retrieve metadata for a post.
        """
        response = self.table.get_item(Key={"PK": f"POST#{post_id}", "SK": "METADATA"})
        return response.get("Item")

if __name__ == "__main__":
    user_post_table = UserPostTable(db_client)
