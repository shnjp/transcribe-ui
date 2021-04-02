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
    event_body = json.loads(event["body"])
    FILE_NAME = event_body["fileName"]
    s3 = boto3.client(
        "s3", region_name=REGION_NAME, config=Config(signature_version="s3v4")
    )
    url = s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={"Bucket": S3_BUCKET_NAME, "Key": f"input/{FILE_NAME}"},
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
            "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
        },
        "body": json.dumps({"preSignedURL": url}),
    }
