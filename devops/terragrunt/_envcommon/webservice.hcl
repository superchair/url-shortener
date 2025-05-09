locals {
  # terraform base location
  base_source_url = "git@github.com:mobials/platform-infrastructure.git//devops/terraform/modules/standard_platform_webservice?ref=v1.1.0"

  # load global variables
  common_vars = yamldecode(file(find_in_parent_folders("common.yaml")))

  # load region-level variables
  region_vars = read_terragrunt_config(find_in_parent_folders("region.hcl"))

  # load environment-level variables
  environment_vars = read_terragrunt_config(find_in_parent_folders("env.hcl"))

  # extract vars for reuse
  app_name = local.common_vars.app_name
  ecs_iam_role = local.common_vars.ecs_iam_role
  execution_role_arn = local.common_vars.execution_role_arn
  region = local.region_vars.locals.aws_region
  environment = local.environment_vars.locals.environment
}

inputs = {
  lb_arn                           = "arn:aws:elasticloadbalancing:us-east-1:456969868172:loadbalancer/app/staging-ecs-external-alb/3a51ecb01780abfa"
  lb_name                          = "staging-ecs-external-alb"
  cluster_name                     = "staging-external-ecs"
  service_name                     = "${local.environment}-${local.app_name}"
  execution_role_arn               = local.execution_role_arn
  ecs_iam_role                     = local.ecs_iam_role
  vpc_id                           = "vpc-0c176c69"
  target_group_name                = "${local.environment}-WRS"
  common_tags                      = {
    "Application" = local.app_name
    "Environment" = local.environment
    "Terraform"   = "true"
    "Department"  = "DevOps"
  }
}
