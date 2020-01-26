provider "aws" {
  region = "ap-northeast-1"
}

terraform {
  required_version = ">= 0.12"
  # backend "s3" {
  #   bucket = "ghelia-annotator-tfstate"
  #   region = "ap-northeast-1"
  #   key    = "dev/terraform.tfstate"
  # }
}

variable "project" {
  default = "mojimoji"
}

variable "environment" {
  default = "dev"
}


locals {
  base_tags = {
    Project     = var.project
    Terraform   = "true"
    Environment = var.environment
  }

  default_tags = merge(
    local.base_tags,
    # {
    #   "kubernetes.io/cluster/${local.cluster_name}" = "shared"
    # },
  )
  base_name    = "${var.project}-${var.environment}"
  cluster_name = "${local.base_name}-cluster"
  # cluster_version = "1.12"
}
