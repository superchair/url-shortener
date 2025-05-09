terraform {
  source = "${include.envcommon.locals.base_source_url}"
}

include "root" {
  path = find_in_parent_folders()
}

include "envcommon" {
  path = "${dirname(find_in_parent_folders())}/_envcommon/webservice.hcl"
  expose = true
}

locals {
  # pull the locals out of the envcommon include for ease of use
  environment = include.envcommon.locals.environment
  app_name = include.envcommon.locals.app_name
  bugsnag_key = include.envcommon.locals.common_vars.bugsnag_key

  # build other locals
  service_host = "autoverify.services"
  host_value = "${local.app_name}.${local.service_host}"
}

inputs = {
  host_value = local.host_value
  host_header_conditions = [
    local.host_value
  ]
  instance_count = 2
  autoscale_min_capacity = 2
  autoscale_max_capacity = 2
  lb_arn = "arn:aws:elasticloadbalancing:us-east-1:456969868172:loadbalancer/app/production-ecs-external-alb/20836285717609cc"
  lb_name = "production-ecs-external-alb"
  cluster_name = "production-external-ecs"
  vpc_id = "vpc-f3d28696"
  template = <<EOF
[
  {
    "name": "${local.environment}-${local.app_name}",
    "image": "456969868172.dkr.ecr.us-east-1.amazonaws.com/platform/${local.app_name}:${local.environment}",
    "cpu": 0,
    "memory": 256,
    "memoryReservation": 256,
    "portMappings": [
      {
        "containerPort": 80,
        "hostPort": 0,
        "protocol": "tcp"
      }
    ],
    "healthCheck": {
        "command": [
            "CMD-SHELL",
            "ls"
        ],
        "interval": 60,
        "timeout": 30,
        "retries": 3,
        "startPeriod": 30
    },
    "essential": true,
    "environment": [
      {
        "name": "APP_ENV",
        "value": "${local.environment}"
      },
      {
        "name": "APP_NAME",
        "value": "rest-api-reference-service"
      },
      {
        "name": "APP_PORT",
        "value": "80"
      },
      {
        "name": "AUTH0_ISSUER",
        "value": "https://production-0k8m6aqc.us.auth0.com/"
      },
      {
        "name": "AUTH0_AUDIENCE",
        "value": "platform-services"
      }
    ],
    "secrets": [
    ]
  }
]
EOF
}
