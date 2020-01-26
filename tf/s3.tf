resource "aws_s3_bucket" "voices" {
  bucket = "mojimoji-voices"
  acl    = "private"
  tags   = local.default_tags

  # cors_rule {
  #   allowed_headers = ["*"]
  #   allowed_methods = ["GET", "PUT"]
  #   allowed_origins = ["http://localhost"]
  # allowed_origins = ["*"]
  #   max_age_seconds = 3600
  # }
}

resource "aws_s3_bucket_policy" "volices-policy" {
  bucket = aws_s3_bucket.voices.id

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
          "Service": "transcribe.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "${aws_s3_bucket.voices.arn}/*"
    }
  ]
}
POLICY
}
