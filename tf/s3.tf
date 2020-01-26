resource "aws_s3_bucket" "dev" {
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

