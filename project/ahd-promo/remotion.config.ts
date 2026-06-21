import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// H.264 mp4 is the default codec for .mp4 outputs.
Config.setConcurrency(null);
