# -- coding: utf-8 --

import boto3
from botocore.client import Config
import uuid
import os
import json

S3_BUCKET_NAME = os.environ["S3_BUCKET_NAME"]
REGION_NAME = "ap-northeast-1"
DURATION_SECONDS = 3600


def lambda_handler(event, context):
    print("Event: {}".format(event))
    FILE_NAME = str(uuid.uuid4())
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
        "isBase64Encoded": False,
        "headers": {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "http://localhost:8080",
            "Access-Control-Allow-Methods": "PUT",
        },
        "body": json.dumps({"preSignedURL": url}),
    }
