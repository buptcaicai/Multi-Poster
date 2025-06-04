#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EcrStack } from '../lib/EcrStack';

const app = new cdk.App();
new EcrStack(app, 'EcrStack', {});