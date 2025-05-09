include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "tfr:///terraform-aws-modules/ecr/aws?version=2.1.1"
}

locals {
  # load global variables
  common_vars = yamldecode(file(find_in_parent_folders("common.yaml")))
}

inputs = {
  create_lifecycle_policy = false
  attach_repository_policy = false
  repository_name = "platform/${local.common_vars.app_name}"
  repository_encryption_type = "KMS"
  repository_kms_key = "arn:aws:kms:us-east-1:456969868172:key/5ebc4d20-37ec-405f-92f8-bb98a90269c0"
  repository_image_tag_mutability = "MUTABLE"
  repository_image_scan_on_push = true
  timeouts = {
    delete = "20m"
  }
  tags = {
    "Terraform"  = "true"
    "Department" = "DevOps"
  }
}
