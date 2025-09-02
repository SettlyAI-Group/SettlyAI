import { MemoryRouter } from 'react-router-dom';
import Banner from './Banner';
import type { Meta } from '@storybook/react-vite';

const meta: Meta<typeof Banner> = {
  title: 'Pages/SuburbReport/Banner',
  component: Banner,
  tags: ['autodocs'],
};
export default meta;

export const Default = () => <Banner suburb="Melbourne" state="VIC" postcode="3000" />;

export const Sydney = () => <Banner suburb="Sydney" state="NSW" postcode="2000" />;

export const Adelaide = () => <Banner suburb="Adelaide" state="SA" postcode="5000" />;
