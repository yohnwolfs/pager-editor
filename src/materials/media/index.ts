import VideoMetadata from './Video/metadata';
import AudioMetadata from './Audio/metadata';
import VideoSchema from './Video/schema';
import AudioSchema from './Audio/schema';
import { MetaData, Schema } from '../interface';

export const metadata: Record<string, MetaData> = {
  Video: VideoMetadata,
  Audio: AudioMetadata,
};

export const schema: Record<string, Schema> = {
  Video: VideoSchema,
  Audio: AudioSchema,
};

export { default as Video } from './Video';
export { default as Audio } from './Audio';
