// Footer.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@testing-library/jest-dom';
import Footer from './Footer';

const theme = createTheme();
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

const renderFooter = (props = {}) => {
  return render(
    <TestWrapper>
      <Footer {...props} />
    </TestWrapper>
  );
};

describe('Footer basic function test', () => {
  test('render Footer component', () => {
    renderFooter();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('show company name and logo', () => {
    renderFooter();
    expect(screen.getByText('🏠')).toBeInTheDocument();
    expect(screen.getByText('Settly AI')).toBeInTheDocument();
  });

  test('show company description', () => {
    renderFooter();
    expect(screen.getByText('Your intelligent companion for finding the perfect suburb to call home.')).toBeInTheDocument();
  });

  test('show all the column title', () => {
    renderFooter();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
    expect(screen.getByText('Follow Us')).toBeInTheDocument();
  });

  test('show all the navigation link', () => {
    renderFooter();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  test('all the links should have href arribute', () => {
    renderFooter();
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

  test('show social media logo', () => {
    renderFooter();
    const socialLinks = screen.getAllByRole('link');
    // should have social media link （LinkedIn + Instagram）
    expect(socialLinks.length).toBeGreaterThanOrEqual(2);
  });

  test('show the copyright information', () => {
    renderFooter();
    expect(screen.getByText('© 2024 Settly AI. All rights reserved.')).toBeInTheDocument();
  });

describe('Footer snapshot test', () => {
    test('Footer component snapshot should match', () => {
      const { container } = renderFooter();
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
