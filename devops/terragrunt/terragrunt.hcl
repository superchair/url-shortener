locals {
  # load global variables
  common_vars = yamldecode(file(find_in_parent_folders("common.yaml")))

  # load region-level variables
  region_vars = read_terragrunt_config(find_in_parent_folders("region.hcl"))
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
  provider "aws" {
    region  = "${local.region_vars.locals.aws_region}"
  }
EOF
}

# Configure Terragrunt to automatically store tfstate files in an S3 bucket
remote_state {
  backend = "s3"
  config = {
    bucket         = "terraform-azure-devops-pipeline-bucket"
    key            = "${local.common_vars.app_name}/${path_relative_to_include()}/terraform.tfstate"
    region         = local.region_vars.locals.aws_region
  }
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
}

catalog {
  urls = [
    "https://github.com/mobials/platform-deployment.git"
  ]
}
