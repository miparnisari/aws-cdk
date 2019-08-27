import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import { Stack } from '@aws-cdk/core';
import targets = require('../lib');

test('Can create target groups with lambda targets', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'Stack');
  const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
  const listener = lb.addListener('Listener', { port: 80 });

  // WHEN
  listener.addTargets('Targets', {
    targets: [new targets.InstanceIdTarget('i-1234')],
    port: 80,
  });

  // THEN
  expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
    Port: 80,
    Protocol: "HTTP",
    Targets: [
      { Id: "i-1234" }
    ],
    TargetType: "instance",
  }));
});