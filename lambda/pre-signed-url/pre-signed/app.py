# -- coding: utf-8 --

import boto3
from botocore.client import Config
import uuid
import os

S3_BUCKET_NAME = os.environ["S3_BUCKET_NAME"]
REGION_NAME = "ap-northeast-1"
DURATION_SECONDS = 3600


def lambda_handler(event, context):
    print("Event: {}".format(event))

    FILE_NAME = str(uuid.uuid4())
    print("IAM_ROLE_ARN", os.environ["IAM_ROLE_ARN"])

    print(FILE_NAME)
    print(S3_BUCKET_NAME)
    print(REGION_NAME)

    s3 = boto3.client(
        "s3", region_name=REGION_NAME, config=Config(signature_version="s3v4")
    )

    url = s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={"Bucket": S3_BUCKET_NAME, "Key": FILE_NAME},
        ExpiresIn=DURATION_SECONDS,
        HttpMethod="PUT",
    )

    print(url)

    return {
        "statusCode": 200,
        "statusDescription": "200 OK",
        "isBase64Encoded": False,
        "headers": {"Content-Type": "text/html; charset=utf-8"},
        "body": "{}\n".format(url),
    }
