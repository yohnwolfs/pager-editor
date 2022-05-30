import Button from './Button';
import Container from './Container';
import Text from './Text';
import PageSlider from './PageSlider';
import ButtonSchema from './Button/schema';
import ContainerSchema from './Container/schema';
import TextSchema from './Text/schema';
import PageSliderSchema from './PageSlider/schema';
import IconSchema from './Icon/schema';
import { Schema } from '../interface';
import ButtonMetaData from './Button/metadata';
import ContainerMetaData from './Container/metadata';
import TextMetaData from './Text/metadata';
import PageSliderMetaData from './PageSlider/metadata';
import IconMetaData from './Icon/metadata';
import { MetaData } from '../interface';

export const metadata: Record<string, MetaData> = {
  Button: ButtonMetaData,
  Container: ContainerMetaData,
  Text: TextMetaData,
  PageSlider: PageSliderMetaData,
  Icon: IconMetaData,
};

export const schema: Record<string, Schema> = {
  Button: ButtonSchema,
  Container: ContainerSchema,
  Text: TextSchema,
  PageSlider: PageSliderSchema,
  Icon: IconSchema,
};

export { Button, Container, Text, PageSlider };
